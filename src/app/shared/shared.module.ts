import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
    declarations: [

    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            preventDuplicates: true,
        }),
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule { }