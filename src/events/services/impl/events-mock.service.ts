import { EventsService } from '../events.service';
import { Event } from '../../models/event';
import { v4 as uuid } from 'uuid';

export class EventsMockService implements EventsService {
  constructor(private _events: Event[]) {}

  /**
   * Creates event
   * @param dateFrom
   * @param dateTo
   * @param title
   */
  async createEvent(dateFrom: string, dateTo: string, title: string): Promise<Event> {
    if (!EventsMockService.validateDateRange(dateFrom, dateTo)) {
      throw new Error('Date range is not valid');
    }
    const eventInProvidedDateRange = this._events.find(
      (event) =>
        EventsMockService.isEventIsInDateRange(dateFrom, dateTo, event) &&
        Date.parse(dateFrom) !== Date.parse(event.endDate),
    );
    if (eventInProvidedDateRange) {
      throw new Error('Events conflict');
    }
    const newEvent: Event = {
      id: uuid(),
      title,
      startDate: dateFrom,
      endDate: dateTo,
    };
    this._events.push(newEvent);
    return newEvent;
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

  /**
   * Gets events
   * @param dateFrom
   * @param dateTo
   * @param offset
   * @param limit
   */
  async getEvents(
    dateFrom: string,
    dateTo: string,
    offset: number,
    limit: number,
  ): Promise<{ totalCount: number; events: Event[] }> {
    if (!EventsMockService.validateDateRange(dateFrom, dateTo)) {
      throw new Error('Date range is not valid');
    }
    const totalResults = this._events.filter((event) =>
      EventsMockService.isEventIsInDateRange(dateFrom, dateTo, event),
    );
    return {
      totalCount: totalResults.length,
      events: totalResults.slice(offset, limit + offset),
    };
  }

  /**
   * Removes event
   * @param id
   */
  async removeEvent(id: string): Promise<void> {
    // Prettier but slower (~0.2ms):
    // this._events = this._events.filter((x) => x.id !== id);

    // Faster one (~0.16ms):
    const existingEventIndex = this._events.findIndex((x) => x.id === id);
    if (existingEventIndex > -1) {
      this._events.splice(existingEventIndex, 1);
    }
  }

  /**
   * Checks if date range is valid
   * @param dateFrom
   * @param dateTo
   * @private
   */
  private static validateDateRange(dateFrom: string, dateTo: string): boolean {
    const conditions = [
      !isNaN(Date.parse(dateFrom)),
      !isNaN(Date.parse(dateTo)),
      Date.parse(dateFrom) <= Date.parse(dateTo),
    ];
    return conditions.every((x) => !!x);
  }

  /**
   * Checks if event is in date range
   * @param dateFrom
   * @param dateTo
   * @param event
   * @private
   */
  private static isEventIsInDateRange(dateFrom: string, dateTo: string, event: Event): boolean {
    const conditions = [
      Date.parse(dateFrom) <= Date.parse(event.startDate),
      Date.parse(dateTo) >= Date.parse(event.endDate),
    ];
    return conditions.every((x) => !!x);
  }
}
