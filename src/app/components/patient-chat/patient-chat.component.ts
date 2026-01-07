import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-chat.component.html',
  styleUrls: ['./patient-chat.component.css']
})
export class PatientChatComponent implements AfterViewInit {
  @ViewChild('chatBody') chatBody!: ElementRef<HTMLElement>;

  userId: number | null = null;
  messages = signal<ChatMessage[]>([]);
  input = '';
  isLoading = signal(false);
  isTyping = signal(false);
  error = signal('');

  constructor(private svc: ChatService) {
    // Ne pas charger l'historique pour les patients anonymes (pas de compte)
  }


  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 50);
    // initial greeting
    if (this.messages().length === 0) {
      this.addMessage({ author: 'bot', message: 'Bonjour ! Je suis le chatbot SmartCare — posez votre question sur les cabinets, médecins ou prenez un RDV.', date: new Date().toISOString() });
    }
  }

  private addMessage(msg: ChatMessage) {
    const msgWithMeta = { ...msg, _id: Date.now() + Math.random(), _new: true } as any;
    this.messages.update(m => [...m, msgWithMeta]);
    setTimeout(() => {
      this.messages.update(list => list.map(item => item._id === msgWithMeta._id ? ({ ...item, _new: false }) : item));
    }, 600);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom() {
    try {
      const el = this.chatBody?.nativeElement;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    } catch (e) {}
  }

  send() {
    const text = (this.input || '').trim();
    if (!text) return;

    const userMsg: ChatMessage = { author: 'user', message: text, date: new Date().toISOString() };
    this.addMessage(userMsg);
    this.input = '';
    this.isLoading.set(true);
    this.isTyping.set(true);
    this.error.set('');

    this.svc.sendMessage(this.userId, text).subscribe({
      next: res => {
        const botMsg: ChatMessage = { author: 'bot', message: res.reply, date: new Date().toISOString() };
        setTimeout(() => {
          this.addMessage(botMsg);
          this.isLoading.set(false);
          this.isTyping.set(false);
        }, 700 + Math.random() * 800);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isTyping.set(false);
        this.error.set('Impossible de contacter le chatbot. Veuillez réessayer.');
      }
    });
  }
}
