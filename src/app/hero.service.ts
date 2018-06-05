import { Injectable } from '@angular/core';
import { Observable, of} from "rxjs/index";
import { Hero } from "./hero";
import { HEROES } from "./mock-heroes";
import { MessagesService} from "./messages.service";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessagesService) { }

  getHeroes() : Observable<Hero[]> {
    this.messageService.add('HeroService: fetched data');
    return of(HEROES);
  }
}
