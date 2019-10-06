import { NgModule } from '@angular/core';
import { UseExampleComponent } from './use-example.component';
import { UseExampleService } from './use-example.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [UseExampleComponent],
  providers: [UseExampleService],
  imports: [CommonModule, HttpClientModule],
  exports: [UseExampleComponent]
})
export class UseExampleModule {}
