# Stage One Task - Backend Track

## Task Description

Set up a basic web server

## Endpoint

- **Method:** GET
- **URL:** `<example.com>/api/hello?visitor_name="Mark"`
  - Replace `<example.com>` with your server's domain or IP address.

## Response Format

The endpoint should respond with a JSON object containing:

```json
{
  "client_ip": "127.0.0.1", // The IP address of the requester
  "location": "New York", // The city of the requester
  "greeting": "Hello, Mark!, the temperature is 11 degrees Celsius in New York"
}
```

