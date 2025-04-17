import { Sample } from "@prisma/client";
import prisma from "../../config/prisma";
import { redisConnection } from "../../lib/redis";

export const createSamplesService = async (body: Sample) => {
  const newSample = await prisma.sample.create({
    data: body,
  });

  //  delete data samples di redis
  // biar kalau ada yang fetch samples bakalan dapat data yang fresh
  await redisConnection.del("samples");

  return newSample;
};

//   console.log("INI SAMPLE DATA DARI DATABASE");

//   await redisConnection.setex("samples", 3600, JSON.stringify(samples));

//   return samples;
// };
