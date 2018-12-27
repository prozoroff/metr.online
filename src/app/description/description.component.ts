import { Component, Input } from '@angular/core';

@Component({
    selector: 'my-description',
    styleUrls: ['./description.component.scss'],
    templateUrl: './description.component.html',
})
export class DescriptionComponent {
    @Input() text: string;

    constructor() {
    }
}
