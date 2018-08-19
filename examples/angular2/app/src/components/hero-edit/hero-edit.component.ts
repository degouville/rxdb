import { Component, ViewChildren, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import {
    Subscription
} from 'rxjs';
import {
    skip
} from 'rxjs/operators';

@Component({
    selector: 'hero-edit',
    templateUrl: './hero-edit.component.html',
    styles: [String(require('./hero-edit.component.less'))],
    providers: [DatabaseService],
})
export class HeroEditComponent implements OnInit {

    @Input('hero') hero: any;
    @Output('done') done = new EventEmitter();

    public synced: Boolean = true;
    public formValue: Number;
    private subs: Subscription[] = [];

    constructor(
        private databaseService: DatabaseService
    ) {
        this.synced = true;
    }

    ngOnInit() {
        this.formValue = this.hero.hp;
        this.subs.push(
            this.hero.$
                .pipe(
                    skip(1)
                )
                .subscribe(() => this.synced = false)
        );
    }

    async submit() {
        await this.hero.atomicSet('hp', this.formValue);
        this.done.emit(true);
    }

    resync() {
        this.formValue = this.hero.hp;
        this.synced = true;
    }

    async cancel() {
        this.done.emit(false);
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
