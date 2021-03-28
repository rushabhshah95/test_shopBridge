import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  formGroup: FormGroup;
  formSubmitted = false;
  showProductCreateSuccessMsg: boolean;
  showProductCreateFailMsg: boolean;
  productCreateSuccessMsg: string;
  productCreateFailMsg: string;
  constructor(private productService: ProductService, private formBuilder: FormBuilder,public router: Router) { }

  ngOnInit()  {
    this.addProduct();
    
  }

  addProduct(){
    let productNameregex = /^[a-zA-Z ]*$/;
    let productDescregex = /^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 ]*$/;
    let productPriceregex = /^(\d+\.\d{1,2})/;
    this.formGroup = this.formBuilder.group({
      productName: [null, [Validators.required, Validators.maxLength(20), Validators.pattern(productNameregex)]],
      productDesc: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(productDescregex)]],
      productPrice: [null, [Validators.required, Validators.pattern(productPriceregex)]],
    });
  }

  onSubmit(product) {
    if(this.formGroup.valid){
      this.productService.create(product)
      .subscribe(
        response => {
          this.showProductCreateSuccessMsg = true;
          this.formSubmitted = true;
          this.productCreateSuccessMsg = "You have successfully added New Product";
          this.formGroup.reset(this.formGroup.value);
        },
        error => {
          this.showProductCreateFailMsg = true;
          this.productCreateFailMsg = "Unfortunately New Product is not added. Try Again!";
        }
      )
    }
  }
} 