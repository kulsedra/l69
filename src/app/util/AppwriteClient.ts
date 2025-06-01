import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Client, Account, Storage, Databases } from 'appwrite';

@Injectable({
    providedIn: 'root'
})
export class AppwriteClient {

    private readonly client = new Client();

    private readonly account = new Account(this.client);

    private readonly storage = new Storage(this.client);

    private databases = new Databases(this.client);

    constructor() {
        this.client
            .setEndpoint(environment.appwriteEndpoint)
            .setProject(environment.appwriteProjectId);
    }

    public async getClubs(): Promise<any> {
        return this.databases.listDocuments(
            'usgang.sg',
            'club',
            []
        );
    }
}
