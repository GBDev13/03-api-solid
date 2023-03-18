import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((user) => user.id === id)

    if (!gym) return null

    return gym
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance <= 10
    })
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}
