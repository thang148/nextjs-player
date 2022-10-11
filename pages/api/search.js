// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { api } from "apiServer"

export default async (req, res) => {
  try {
    const ress = await api.search(null, req.query)
    console.log(ress)
    res.status(200).json(ress)
  } catch (error) {
    res.status(400).json(error)
  }
}
