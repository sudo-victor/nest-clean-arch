import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggrageteCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggrageteCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()
    DomainEvents.register(callbackSpy, CustomAggrageteCreated.name)

    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
