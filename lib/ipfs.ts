import axios from "axios";
export type DaoMetadata = {
  name: string;
  description: string;
  avatar?: string;
  links: DaoResourceLink[];
};
export type DaoResourceLink = {
  name: string;
  url: string;
};
export async function pinMetadata(data: Object) {
  const body = {
    pinataContent: JSON.stringify(data),
    pinataOptions: {
      cidVersion: 0,
    },
  };
  const JWT = process.env.PINATA_API_KEY;
  if (!JWT) {
    throw new Error("No Pinata API Key found");
  }

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (error) {
    console.error(error);
  }
}
