import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>
    ) {}
    
    //생성
    async create(dto: CreateEventDto): Promise<Event> {
        return this.eventModel.create(dto);
    }
    
    //전체검색
    async findAll(
        user: { 
            userId: string; 
            role: string 
        }, 
        filter: { 
            title?: string; 
            description?: string; 
            conditions?: Record<string, any>; 
            status?: Boolean; 
            startDate?: string; 
            endDate?: string; 
            creator?: string 
    }): Promise<any[]> {
        const query: any = {};

        // 필터링 기능 eventId별
        if (filter.title) {
            query.title = filter.title;
        }
        // 필터링 기능 description별
        if (filter.description) {
            query.description = filter.description;
        }
        // 필터링 기능 conditions별
        if (filter.conditions) {
            query.conditions = filter.conditions;
        }
        // 필터링 기능 status별
        if (filter.status) {
            query.status = filter.status;
        }
        // 필터링 기능 startDate별
        if (filter.startDate) {
            query.startDate = filter.startDate;
        }
        // 필터링 기능 endDate별
        if (filter.endDate) {
            query.endDate = filter.endDate;
        }
        // 필터링 기능 creator별
        if (filter.creator) {
            query.creator = filter.creator;
        }
        return this.eventModel.find(query).exec();
    }
    

    //생성자가 만든 모든 이벤트 검색
    async findAllByCreator(creator: string): Promise<Event[]> {
        const events = await this.eventModel.find({ creator }).exec();
        if (!events || events.length === 0) {
            throw new NotFoundException(`생성자(${creator})가 만든 이벤트가 없습니다.`);
        }
        return events;
    }

    // 삭제
    async delete(id: string): Promise<{ message: string }> {
        const result = await this.eventModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`이벤트(id: ${id})를 찾을 수 없습니다.`);
        }
        return { message: `이벤트(id: ${id})가 삭제되었습니다.` };
    }
}
