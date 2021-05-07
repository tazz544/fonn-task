import { EventsService } from '../events.service';
import { Event } from '../../models/event';

export class EventsMockService implements EventsService {
  constructor(private _events: Event[]) {}

  createEvent(dateFrom: string, dateTo: string, title: string): Promise<Event> {
    // @ts-ignore
    return Promise.resolve({}); // todo: implement method
  }

  /**
   * Gets event
   * @param id
   */
  async getEvent(id: string): Promise<Event> {
    const existingEvent = this._events.find((x) => x.id === id);
    if (!existingEvent) {
      throw new Error('Event with ID does not exist');
    }
    return existingEvent;
  }

  getEvents(
    dateFrom: string,
    dateTo: string,
    offset: number,
    limit: number,
  ): Promise<{ totalCount: number; events: Event[] }> {
    // @ts-ignore
    return Promise.resolve({}); // todo: implement method
  }

  removeEvent(id: string): Promise<void> {
    // @ts-ignore
    return Promise.resolve({}); // todo: implement method
  }
}
