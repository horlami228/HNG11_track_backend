import axios from "axios";

const weatherKey = process.env.OPEN_WEATHER_API || "";
// This function is used to get  the current temperature in a city
// console.log("weeatherkey", weatherKey);
const getTemp = async (city: string) => {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${weatherKey}`,
    );

    console.log("weather response", response);

    const temp = response.data?.main?.temp;

    // temp is in kelvin need to convert to celcius

    const celcius = temp - 273.15;
    return celcius.toFixed(2);
  } catch (error: any) {
    console.log(error.message);
  }
};

export default getTemp;
