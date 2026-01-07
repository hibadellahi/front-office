import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface ChatMessage {
  id?: number;
  userId?: number | null;
  author: 'user' | 'bot';
  message: string;
  date?: string;
  // helper fields for frontend animations
  _id?: number;
  _new?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  // Backend chat endpoint (ajustez si besoin). Use full backend path.
  private apiUrl = 'http://localhost:8091/api/chatbot';
  private sessionKey = 'chat_session_id';

  constructor(private http: HttpClient) {}

  private getSessionId(): string | null {
    return localStorage.getItem(this.sessionKey);
  }

  private setSessionId(id: string) {
    localStorage.setItem(this.sessionKey, id);
  }

  sendMessage(userId: number | null, message: string): Observable<{ reply: string }> {
    // The backend accepts GET /ask?sessionId=...&question=...
    let params = new HttpParams().set('question', message);
    const sessionId = this.getSessionId();
    if (sessionId) {
      params = params.set('sessionId', sessionId);
    }

    return this.http.get<{ response?: string; reply?: string; sessionId?: string }>(`${this.apiUrl}/ask`, { params })
      // store sessionId returned by the server (if any) and map to { reply }
      .pipe(
        tap(res => { if (res.sessionId) this.setSessionId(res.sessionId); }),
        map(res => ({ reply: res.response ?? res.reply ?? '' }))
      );
  }


}
