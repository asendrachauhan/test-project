import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/msg.model';
@Injectable({
  providedIn: 'root'
})
export class MsgService {

   private apiUrl = 'http://localhost:3000/api/msg/messages';

    constructor(private http: HttpClient) {}

 public getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }
}
