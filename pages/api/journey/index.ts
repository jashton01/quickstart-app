import type { NextApiRequest, NextApiResponse } from "next";

const apiBaseUrl = process.env.API_BASE_URL;
//Do not expose these to the client-side. These tokens are sensitive; They should only exist in server-side.
const authToken =
  process.env.WORKFLOW_TOKEN + ":" + process.env.WORKFLOW_SECRET;
const journeyToken = process.env.JOURNEY_TOKEN!;
console.log("your token is"+journeyToken)
const postRequest = async (journeyToken: string, data: string) => {
  const apiUrl = apiBaseUrl + "journeys/" + journeyToken + "/applications";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Basic " + Buffer.from(authToken).toString("base64"),
      "Content-Type": "application/json",
      "alloy-journey-application-sync": "true",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  postRequest(journeyToken, req.body)
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(400).json("API call was not successful");
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });
}
