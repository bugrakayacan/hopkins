import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSourceURL = "assets/messages.json";
  constructor(private http: HttpClient) { }

  getMessage():Observable<any>{
    return this.http.get<any>(this.messageSourceURL);
  }

  getAnswer(question:string, lan:string):Observable<any>{
    if(lan == 'en')
    {
      return this.http.get<any>(this.messageSourceURL).pipe(
        map((data:any) => {
          const matchedQuestion = data.questions.find((q:any) => question.toLowerCase().includes(q.question.toLowerCase()));
          return matchedQuestion ? { answer: matchedQuestion.answer, type:matchedQuestion.tipi, answer2:matchedQuestion.answer2 } : { answer: data.defaultAnswerEN, type:"text"};
      }))
    }
    else
    {
      return this.http.get<any>(this.messageSourceURL).pipe(
        map((data:any) => {
          const matchedQuestion = data.questions.find((q:any) => question.toLowerCase().includes(q.question.toLowerCase()));
          return matchedQuestion ? { answer: matchedQuestion.answer, type:matchedQuestion.tipi, answer2:matchedQuestion.answer2 } : { answer: data.defaultAnswerTR, type:"text"};
      }))
    }

  }



}
