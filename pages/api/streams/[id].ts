import { NextApiRequest, NextApiResponse } from "next"
import withHandler from "libs/server/withHandler"
import client from "libs/server/client"
import withApiSession, { ResponseType } from "libs/server/withApiSession"

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  const {
    query: { id },
  } = req

  if (!id) return res.status(404).json({ ok: false })

  const stream = await client.stream.findUnique({
    where: {
      id: +id?.toString(),
    },
  })

  if (!stream) return res.status(404).json({ ok: false })

  res.json({ ok: true, stream })
}

export default withApiSession(withHandler({ methods: ["GET"], handler }))
