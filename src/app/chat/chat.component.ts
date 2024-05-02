import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef,Inject,OnInit,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { MessageService } from '../message.service';
import { HttpClientModule } from '@angular/common/http';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,CommonModule, HttpClientModule, MatButtonModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewChecked {
  userInput: string = ''; // Kullanıcı girişi
  messages: { content: string, sender: string, tip:string }[] = [];
  test:any;
  public lang:string= 'xx';

  


  constructor(private messageService : MessageService,@Inject(DOCUMENT) document: Document,private sanitizer: DomSanitizer, public dialog: MatDialog) {
    this.botRespond("GirisMesajimiz");
    
  }


  ngAfterViewChecked(): void {
    const el = document.getElementById('acaba');
    if(el)
      el.scrollTop = el.scrollHeight;
  }


  // Kullanıcı mesajı gönderme işlemi
  sendMessage() {
    if(this.lang !== 'xx')
    {
      if (this.userInput.trim() !== '') {
        this.messages.push({ content: this.userInput, sender: 'user',tip:'text' }); // Kullanıcı mesajını ekle
        this.botRespond(this.userInput); // Botun cevap vermesini sağla
        
        this.userInput = '';
      }
    } 
    else
    {
      this.messages.splice(0);
      this.botRespond("GirisMesajimiz");
      this.userInput = '';
    }
    

    
  }

  // Botun cevap vermesi
  botRespond(question:string) {
    this.messageService.getAnswer(question, this.lang).subscribe(data => {
      let botResponse = data.answer;
      const answerType = data.type;
      if(answerType=='video')
        {
          botResponse = this.sanitizer.bypassSecurityTrustResourceUrl(data.answer);
        }
      console.log(botResponse);
      this.messages.push({content: botResponse, sender: 'bot',tip: answerType});
      if(data.answer2)
      this.messages.push({content: data.answer2, sender: 'bot',tip: 'text'})
    })
  }

  setLang(newLang:string)
  {
    this.lang = newLang;
    console.log(this.lang);
    this.messages.splice(0);
    if(this.lang== 'en')
      this.botRespond('Welcome Message');
    else
      this.botRespond('Hosgeldin Mesaji');
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != this.lang && result != undefined)
      { 
        this.setLang(result); }// Modaldan dönen değeri kontrol etme
    });
  }
  
}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  styleUrl: './chat.component.scss'
})
export class DialogAnimationsExampleDialog  {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}

  returnEN(): void {
    this.dialogRef.close('en'); // Modaldan geri dönülen değeri belirtme
  }

  returnTR(): void {
    this.dialogRef.close('tr'); // Modaldan geri dönülen değeri belirtme
  }

  
}