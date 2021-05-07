import { EventsService } from '../events.service';
import { EventsMockService } from './events-mock.service';
import { EventsMockData } from '../../mock-data/event';
import { Event } from '../../models/event';
import { v4 as uuid } from 'uuid';

describe('EventsMockService', () => {
  let eventsService: EventsService;

  beforeEach(() => {
    eventsService = new EventsMockService([...EventsMockData]);
  });

  describe('createEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.createEvent).toBeDefined();
      expect(typeof eventsService.createEvent).toBe('function');
    });
    it('creates new event with proper props', async () => {
      const newEvent: Partial<Event> = {
        title: 'test',
        startDate: '2021-12-31T20:00:00.000Z',
        endDate: '2021-12-31T20:00:00.000Z',
      };
      const createdEvent = await eventsService.createEvent(newEvent.startDate, newEvent.endDate, newEvent.title);
      expect(eventsService.getEvent(createdEvent.id)).resolves.toBe(createdEvent);
    });
    it('throws error with incorrect dates', () => {
      const newEvent: Partial<Event> = {
        title: 'test',
        startDate: '2020-12-31T20:00:00.000Z',
        endDate: '2021-12-31T20:00:00.000Z',
      };
      expect(eventsService.createEvent(newEvent.startDate, newEvent.endDate, newEvent.title)).rejects.toThrow(Error);
    });
  });

  describe('getEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.getEvent).toBeDefined();
      expect(typeof eventsService.getEvent).toBe('function');
    });
    it('returns event for proper event ID', () => {
      expect(eventsService.getEvent(EventsMockData[0].id)).resolves.toBe(EventsMockData[0]);
    });
    it('throws error for incorrect event ID', () => {
      expect(eventsService.getEvent(uuid())).rejects.toThrow(Error);
    });
  });

  describe('getEvents()', () => {
    it('is defined of type function', () => {
      expect(eventsService.getEvents).toBeDefined();
      expect(typeof eventsService.getEvents).toBe('function');
    });
    it('returns events for proper date range', () => {
      const firstEvent = EventsMockData[0];
      const lastEvent = EventsMockData[EventsMockData.length - 1];
      expect(eventsService.getEvents(firstEvent.startDate, lastEvent.startDate, 0, 10)).resolves.toContain([
        firstEvent,
        lastEvent,
      ]);
    });
    it('throws error for incorrect date range', () => {
      const firstEvent = EventsMockData[0];
      const lastEvent = EventsMockData[EventsMockData.length - 1];
      expect(eventsService.getEvents(lastEvent.startDate, firstEvent.startDate, 0, 10)).rejects.toThrow(Error);
    });
  });

  describe('removeEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.removeEvent).toBeDefined();
      expect(typeof eventsService.removeEvent).toBe('function');
    });
    it('removes event with proper ID', () => {
      expect(eventsService.removeEvent(EventsMockData[0].id)).resolves.toBeCalled();
      expect(eventsService.getEvent(EventsMockData[0].id)).rejects.toThrow(Error);
    });
    it('removes event with incorrect ID', () => {
      const randomId = uuid();
      expect(eventsService.removeEvent(randomId)).resolves.toBeCalled();
      expect(eventsService.getEvent(randomId)).rejects.toThrow(Error);
    });
  });
});
