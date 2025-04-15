import prisma from "../../config/prisma";

export default async function getEventsService() {
  const events = await prisma.event.findMany();

  return events;
}
