import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket-service';
import { FormsModule } from '@angular/forms';
import { MsgService } from '../../services/msgService';
import { Message } from '../../models/msg.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.scss',
})
export class ChatRoom implements OnInit, OnDestroy {
  private messageSubscription: Subscription | undefined;
  public messages: Message[] = [];
  public newMessage: string = '';
  public loading: boolean = false;

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private msgService: MsgService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadMessages();

    this.messageSubscription = this.socketService
      .on('message')
      .subscribe(() => {
        this.ngZone.run(() => {
          this.loadMessages(); // 💡 Just reload
        });
      });
  }

  private loadMessages() {
    this.msgService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load messages', err);
      },
    });
  }

  public sendMessage() {
    if (!this.newMessage.trim()) return;

    this.loading = true;
    this.socketService.emit('message', { text: this.newMessage });
    this.newMessage = '';
    this.loading = false; // The push will reload messages
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }
}
