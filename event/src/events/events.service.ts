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
    async findAll(): Promise<any[]> {
        const eventList = await this.eventModel.find().exec();
        return this.eventModel.find().exec();
    }

    //생성자가 만든 모든 이벤트 검색
    async findAllByCreator(creator: string): Promise<Event[]> {
        const events = await this.eventModel.find({ creator }).exec();
        if (!events || events.length === 0) {
            throw new NotFoundException(`생성자(${creator})가 만든 이벤트가 없습니다.`);
        }
        return events;
    }
    //id로 검색
    /*
    async findById(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id).exec(); // exec 추가
        if (!event) {
        throw new NotFoundException(`이벤트(id: ${id})를 찾을 수 없습니다.`); 
        }
        return event; 
    }
    */

    // 삭제
    async delete(id: string): Promise<{ message: string }> {
        const result = await this.eventModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`이벤트(id: ${id})를 찾을 수 없습니다.`);
        }
        return { message: `이벤트(id: ${id})가 삭제되었습니다.` };
    }
}
