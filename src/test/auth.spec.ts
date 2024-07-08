import { expect } from 'chai';
import request from 'supertest';
import {app} from "../server.js";
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Organisation from '../models/orgModel.js';
import "../config.js";

describe('User Authentication & Organisation', () => {

  let token: string;
  let userId: string;
  let orgId: string;

  before(async () => {
    // Clean up database
    await User.destroy({ where: {} });
    await Organisation.destroy({ where: {} });
  });

  describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          phone: '1234567890'
        });

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('Registration successful');
      expect(res.body.data).to.have.property('accessToken');
      expect(res.body.data.user).to.include({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890'
      });

      token = res.body.data.accessToken;
      userId = res.body.data.user.userId;
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com'
          // Missing password
        });

      expect(res.status).to.equal(422);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.include({
        field: 'password',
        message: 'Password is required'
      });
    });

    it('should fail if email is duplicate', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.doe@example.com', // Duplicate email
          password: 'password123',
          phone: '0987654321'
        });

      expect(res.status).to.equal(422);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.include({
        field: 'email',
        message: 'Email already exists'
      });
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in successfully', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('Login successful');
      expect(res.body.data).to.have.property('accessToken');
      expect(res.body.data.user).to.include({
        email: 'john.doe@example.com'
      });

      token = res.body.data.accessToken;
    });

    it('should fail if email or password is incorrect', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).to.equal(401);
      expect(res.body.status).to.equal('Bad request');
      expect(res.body.message).to.equal('Authentication failed');
    });
  });

  describe('Token Generation', () => {
    it('should contain correct user details and expiry time', async () => {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
      expect(decoded).to.include({
        email: 'john.doe@example.com'
      });
      expect(decoded.exp).to.be.a('number');
    });
  });

  describe('Organisation Access Control', () => {
    it('should prevent users from accessing organisations they don’t have access to', async () => {
      // Create a new user
      const newUserRes = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          password: 'password123',
          phone: '0987654321'
        });

      const newToken = newUserRes.body.data.accessToken;

      // Attempt to access organisations with the new user
      const res = await request(app)
        .get('/api/organisations')
        .set('Authorization', `Bearer ${newToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.organisations).to.be.an('array').that.is.empty;
    });
  });

  describe('GET /api/organisations', () => {
    it('should get all organisations the user belongs to or created', async () => {
      const res = await request(app)
        .get('/api/organisations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.organisations).to.be.an('array');
    });
  });

  describe('GET /api/organisations/:orgId', () => {
    it('should get a single organisation record', async () => {
      const orgRes = await request(app)
        .get('/api/organisations')
        .set('Authorization', `Bearer ${token}`);
      
      orgId = orgRes.body.data.organisations[0].orgId;

      const res = await request(app)
        .get(`/api/organisations/${orgId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.include({
        orgId,
        name: "John's Organisation"
      });
    });
  });
});
