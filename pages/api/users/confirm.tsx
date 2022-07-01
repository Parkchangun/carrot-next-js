import { NextApiRequest, NextApiResponse } from "next"
import withHandler, { Response } from "@libs/server/withHandler"
import client from "@libs/server/client"
import { withIronSessionApiRoute } from "iron-session/next"

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { token: payload } = req.body
  console.log(payload)
  const token = await client.token.findUnique({
    where: {
      payload,
    },
    include: { user: true },
  })
  console.log(token)
  if (!token) {
    console.log("none token")
    res.status(404).end()
  } else {
    req.session.user = {
      id: token.userId,
    }
    await req.session.save()
    console.log("saving")
    res.status(200).end()
  }
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrot",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
  password:
    "1231243253234j1234uioeruawe9r08as-sdfzxcfjkta;rtwerktseiopritdfgjadks",
})
