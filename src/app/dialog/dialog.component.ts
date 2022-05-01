import { ApiService } from './../services/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  freshinessList = ['Brand New', 'Second Hand', 'Refurbished'];
  actionBtn:string = 'Save';
  productForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });
    console.log('productForm status', this.productForm);

    if(this.editData){
      this.actionBtn = 'Update'
      console.log('productForm editData', this.editData);
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct() {
    if(!this.editData){
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (data) => {
            console.log('Product added successfully', data);
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            console.log('error', err);
          },
        });
      }
    } else {
      this.updateProduct();
    }

  }

  updateProduct(){
    this.api.putProduct(this.editData.id, this.productForm.value)
    .subscribe({
      next:(res) => {
        console.log('product update success!!');
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: (err) => {
        console.error('error', err);
      }
    })
  }
}
