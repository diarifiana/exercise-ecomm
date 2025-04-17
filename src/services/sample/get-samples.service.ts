import prisma from "../../config/prisma";
import { redisConnection } from "../../lib/redis";

export const getSamplesService = async () => {
  // cek dulu data samples di redis ada atau tidak
  // jika ada langsung return data yang ada di redis
  // kalau tidak ada, ambil data samples dari database
  // lalu masukkan data dari database ke redis
  // selanjutnya return datanya

  const cachedSamples = await redisConnection.get("samples");

  if (cachedSamples) {
    console.log("INI SAMPLE DATA DARI REDIS");
    return JSON.parse(cachedSamples);
  }

  const samples = await prisma.sample.findMany();

  console.log("INI SAMPLE DATA DARI DATABASE");

  await redisConnection.setex("samples", 3600, JSON.stringify(samples));

  return samples;
};
