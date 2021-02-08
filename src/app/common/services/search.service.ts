import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SearchService {
    public selectedFilterdropdown : any = 'all';
    public selectedLanguageOption : any = 'all';

    /**
     * Holds Seach Term
     */
    private searchTerm: BehaviorSubject<any> = new BehaviorSubject({});

    /**
     * Holds Seach Term
     */
    private searchResultsPageStatus: BehaviorSubject<any> = new BehaviorSubject({});

     /**
     * Holds json Response
     */
    private searchResultJsonResponse: BehaviorSubject<any> = new BehaviorSubject({});

    constructor() { }

    /**
     * Search Term - Setter
     * @param data 
     */
    setSearchTerm(data) {
        this.searchTerm.next(data);
    }

    /**
     * Search Term - Getter
     */
    getSearchTerm(): Observable<any> {
        return this.searchTerm;
    }

    /**
     * Search json Response - Setter
     * @param data 
     */
    setSearchResultJsonResponse(data) {
        this.searchResultJsonResponse.next(data);
    }
    
    /**
     * Search Term Response - Getter
     */
    getSearchResultJsonResponse(): Observable<any> {
        return this.searchResultJsonResponse;
    }
    
    /**
     * Search Term Response - Setter
     * @param data 
     */
    setSearchResultsPageStatus(data) {
        this.searchResultsPageStatus.next(data);
    }

    /**
     * Search Term Response - Getter
     */
    getSearchResultsPageStatus(): Observable<any> {
        return this.searchResultsPageStatus;
    }

    
}