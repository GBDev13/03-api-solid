import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -27.8055815,
      longitude: -50.3035184,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -28.2919965,
      longitude: -51.4455635,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.8037361,
      userLongitude: -50.3379239,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
