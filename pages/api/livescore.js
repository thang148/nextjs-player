// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { apiLiveScore } from "api"

export default async (req, res) => {
  try {
    const { data } = await apiLiveScore.getLiveSocres(req.query)
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json(error)
  }
}
