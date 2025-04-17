/* eslint-disable prettier/prettier */
// 4. Créons le service de messagerie
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../Model/message.model';
import { User } from '../Model/user.model';
import { CreateMessageDto } from '../Model/Dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async sendMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const sender = await this.usersRepository.findOne({ where: { id: senderId } });
    const receiver = await this.usersRepository.findOne({ where: { id: createMessageDto.receiverId } });

    if (!sender || !receiver) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const message = new Message();
    message.content = createMessageDto.content;
    message.sender = sender;
    message.receiver = receiver;
    message.senderId = senderId;
    message.receiverId = createMessageDto.receiverId;

    return this.messagesRepository.save(message);
  }

  async getConversation(userId: string, otherUserId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver']
    });
  }

  async getReceivedMessages(userId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { receiverId: userId },
      order: { createdAt: 'DESC' },
      relations: ['sender']
    });
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({ 
      where: { id: messageId, receiverId: userId } 
    });

    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    message.isRead = true;
    return this.messagesRepository.save(message);
  }
}
