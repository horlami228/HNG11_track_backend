import axios from "axios";

const token = process.env.IP_INFO_TOKEN;
// console.log("token", token);
const getLocation = async (ip: string) => {
  try {
    console.log("the ip address is", ip);
    const response = await axios.get(`https://ipinfo.io/${ip}?${token}`);
    if (response) {
      console.log(response);
    }
    return response?.data;
  } catch (error: any) {
    console.error(error.message);
  }
};

export default getLocation;
