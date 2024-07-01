import { Request, Response, NextFunction } from "express";
import getLocation from "../utilities/getLocation.js";
import getTemp from "../utilities/getTemperature.js";
// A GET request endpoint for greetings
// it takes in name as query string and returns the ip, location, temperature and passed in name

export const greeting = async (req: Request, res: Response) => {
  try {
    const name = req.query?.visitor_name; // query string
    const forwardedFor = ((req.headers["x-forwarded-for"] as string) || "")
      .split(",")[0]
      .trim();
    let ip = forwardedFor || req.socket.remoteAddress;

    if (!ip) {
      return console.log("ip address not found");
    }
    console.log("Client IP:", ip);
    if (!name) {
      return res.status(400).json({
        error: "visitor_name is required",
        usage: "/api/hello?visitor_name=??",
      });
    }
    if (process.env.NODE_ENV === "development") {
      ip = "102.89.22.27";
    }
    const location = await getLocation(ip); // get location from the ip
    const temperature = await getTemp(location.city); // get the temperature from the city name
    console.log(location);
    return res.status(200).json({
      client_ip: location.ip,
      location: location.city,
      greeting: `Hello, ${name}!, the temperature is ${temperature} degrees Celcius in ${location.city}`,
    });
    // get location of the client
  } catch (error: any) {
    console.log(error.messae);
  }
};
