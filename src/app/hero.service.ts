import { Injectable } from '@angular/core';
import { Observable, of} from "rxjs/index";
import { Hero } from "./hero";
import { MessagesService} from "./messages.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/internal/operators";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class HeroService {

    private log(message: string) {
        this.messageService.add('HeroService: ' + message);
    }

    private heroesUrl = 'api/heroes';

    constructor(
        private messageService: MessagesService,
        private http: HttpClient
    ) { }

    getHeroes() : Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
              tap(heroes => this.log(`fetched heroes`)),
              catchError(this.handleError('getHeroes', []))
            )

    }

    getHero(id: number): Observable<Hero> {
        this.messageService.add(`[HeroService]: Fetched hero id=${id}`);
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url)
            .pipe(
                tap(_ => this.log(`fetched hero id=${id}`)),
                catchError(this.handleError<Hero>(`getHero id=${id}`))
            );
    }

    /**
     * Update a hero
     * @param {Hero} hero
     * @returns {Observable<any>}
     */
    updateHero(hero: Hero): Observable<any> {
        return this.http.put(this.heroesUrl, hero, httpOptions)
            .pipe(
                tap(_ => this.log(`Updated hero id=${hero.id}`)),
                catchError(this.handleError<any>('updateHero'))
            );
    }

    /**
     * Add new hero
     * @param {Hero} hero
     * @returns {Observable<Hero>}
     */
    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
            .pipe(
                tap((hero: Hero) => this.log(`Added new hero w/ id=${hero.id}`)),
                catchError(this.handleError<Hero>('addHero'))
            );
    }

    /**
     * Delete a hero
     * @param {Hero | number} hero
     * @returns {Observable<Hero>}
     */
    deleteHero(hero: Hero | number): Observable<Hero> {
        const id = typeof hero === "number" ? hero : hero.id;
        const url = `${this.heroesUrl}/${id}`;

        return this.http.delete<Hero>(url, httpOptions)
            .pipe(
                tap(_ => this.log(`Deleted hero id=${id}`)),
                catchError(this.handleError<Hero>('deleteHero'))
            )
    }

    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {return of([]);}

        return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
            .pipe(
                tap(_ => this.log(`found heroes matching "${term}"`)),
                catchError(this.handleError<Hero[]>('searchHeroes', []))
            )
    }


    /*  --------------------    */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
