import * as Mongoose from 'mongoose'
import { ObjectClean, ObjectHasKey, ObjectOmit, StringOmit, StringContains} from "typelevel-ts";
import { Model as MonModel, Document, Query, Types, Schema, model } from "mongoose";
import { FindAndUpdateOption } from 'mongoose';
import { Aggregate } from 'mongoose';

// Mongoose enhancements, for everything that includes redblade-types

export type ObjectId = Mongoose.Types.ObjectId;


export interface ISchemaPropsRaw {
   _id?: IPlainType<ObjectId>;
   id?: IPlainType<string>;
}

export type OidOrStringRaw = IPlainType<ObjectId | string>;

// Enhance the mongoose class with the missing function that should be found.
declare module 'mongoose'
{

   //function model<Schema extends MDocument>(name: string, schema?: Schema, collection?: string, skipInit?: boolean): Model<Schema>;

   export module Types {

       interface ObjectId
       {
           toString: () => string;  
       }
   }

   export type QueryIdRequired<T> = Query<MakeIdRequired<T>>
   export type MakeIdRequired<T> = ObjectOmit<T,'id'> & {
       id : string
   }

   export type MakeRecord<T> = ObjectOmit<T, StringOmit<keyof Document,'_id'>>

   export type MakeNewRecordDoc<T> = ObjectOmit<T, StringOmit<keyof Document, 'id'>>

   export type MakeResultRecordDoc<T> = ObjectOmit<T, '_id' | 'id'>

   export interface Model<T extends Document>
   //extends NodeJS.EventEmitter
   {
       newType : MakeNewRecordDoc<T>;

       new(doc?: MakeNewRecordDoc<T>, fields?: Object, skipInit?: boolean): MakeResultRecordDoc<T>;

       new(doc?: Object, fields?: Object, skipInit?: boolean): 'Invalid Record' & void;

       aggregate<X>(...aggregations: Object[]): Aggregate<X[]>;
       aggregate<X>(aggregation: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
       aggregate<X>(aggregation1: Object, aggregation2: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
       aggregate<X>(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;

       aggregate(...aggregations: Object[]): 'Invalid Record' & void;
       aggregate(aggregation: Object, callback: (err: any, res: T[]) => void): 'Invalid Record' & void;
       aggregate(aggregation1: Object, aggregation2: Object, callback: (err: any, res: T[]) => void): 'Invalid Record' & void;
       aggregate(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: T[]) => void): 'Invalid Record' & void;
      
       distinct<X>(field: string, callback?: (err: any, res: X[]) => void): Query<X[]>;
       distinct<X>(field: string, conditions: Object, callback?: (err: any, res: X[]) => void): Query<X[]>;

       distinct(field: string, callback?: (err: any, res: T[]) => void): 'Invalid Record' & void;
       distinct(field: string, conditions: Object, callback?: (err: any, res: T[]) => void): 'Invalid Record' & void;

       findById(id: string | ObjectId, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findById(id: string | ObjectId, fields: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findById(id: string | ObjectId, fields: Object, options: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findByIdAndRemove(id: string | ObjectId, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findByIdAndRemove(id: string | ObjectId, options: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findByIdAndUpdate(id: string | ObjectId, update: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findByIdAndUpdate(id: string | ObjectId, update: Object, options: FindAndUpdateOption, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
  
       // sdsdfsdf
       find(): QueryIdRequired<T[]>;
       find(cond: Object, callback?: (err: any, res: MakeIdRequired<T>[]) => void): QueryIdRequired<T[]>;
       find(cond: Object, fields: Object, callback?: (err: any, res: MakeIdRequired<T>[]) => void): QueryIdRequired<T[]>;
       find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: MakeIdRequired<T>[]) => void): QueryIdRequired<T[]>;
      
       findOne(cond?: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findOne(cond: Object, fields: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;
       findOne(cond: Object, fields: Object, options: Object, callback?: (err: any, res: MakeIdRequired<T>) => void): QueryIdRequired<T>;

       create(doc: MakeRecord<T>, fn?: (err: any, res: MakeIdRequired<T>) => void): Promise<QueryIdRequired<T>>;
       create(doc1: MakeRecord<T>, doc2: Object, fn?: (err: any, res1: MakeIdRequired<T>, res2: MakeIdRequired<T>) => void): Promise<QueryIdRequired<T>[]>;
       create(doc1: MakeRecord<T>, doc2: Object, doc3: Object, fn?: (err: any, res1: MakeIdRequired<T>, res2: MakeIdRequired<T>, res3: MakeIdRequired<T>) => void): Promise<QueryIdRequired<T>[]>;
  
       // Could here never here, but it doesn't work. so a message and void would be better as the person knows what actually wrong.
       // since the compiler doen't actually sort things out properly.
       create(doc: Object, fn?: (err: any, res: T) => void) : 'Invalid Record' & void;
       create(doc1: Object, doc2: Object, fn?: (err: any, res1: T, res2: T) => void): 'Invalid Record' & void;
       create(doc1: Object, doc2: Object, doc3: Object, fn?: (err: any, res1: T, res2: T, res3: T) => void): 'Invalid Record' & void;
 
       count(conditions: Object, callback?: (err: any, count: number) => void): Query<number>;

   }

   export interface Query<T> {
       lean(): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
       lean(bool : true): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
       lean(bool? : true): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
       lean(bool? : undefined): Query<ObjectOmit<T, StringOmit<keyof Document, '_id'>>>;
   }

   export interface Document {
       save<T>(callback?: (err: any, res: MakeIdRequired<T>) => void): void;
   }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////

/*
export namespace RawSchema {

   export interface ColLeftRawSchemaReadOnly {
       readonly created : Date
       readonly version : number
   }

   export interface ColLeftRawSchema {
       //created: IReadOnly<Date>,
       //version: IReadOnly<Number>,
       _id : IPlainType<string | Types.ObjectId>
       date : IPlainType<Date>
       title : IPlainType<'ColLeft'>
       a : IPlainType<'A-1'>,
       b :{
           c : IPlainType<'b-c'>
       }
       ref : IRefType<ColRightRawSchema []>
       refA : IRefType<ColRightRawSchema>
   }


   export interface ColRightRawSchema {
       _id : IPlainType<string | Types.ObjectId>
       date : IPlainType<Date>
       Title : IPlainType<'ColRight'>
       y : IPlainType<'Y-1'>,
       z : {
           z : IPlainType<'z-x'>
       }
       refC : IRefType<ColLeftRawSchema>
       refB : IRefType<ColRightRawSchema>
   }
}


export type ColLeftSchema = TransformRaw<RawSchema.ColLeftRawSchema,{}> & RawSchema.ColLeftRawSchemaReadOnly
   const colLeftScehma : ColLeftSchema = {
       _id: 'sdf',
       date: new Date(),
       title : 'ColLeft',
       a : 'A-1',
       b : {
           c: 'b-c'
       },
       refA:'',
       ref : 'string',
       created : new Date(),
       version : 1
   }

   export const colLeft = model<RawSchema.ColLeftRawSchema, RawSchema.ColLeftRawSchemaReadOnly>('modelColLeft', new Schema());
   const recordColLeftValue : typeof colLeft.newType
    = {
       _id: 'sdf',
       date: new Date(),
       title : 'ColLeft',
       a : 'A-1',
       b : {
           c: 'b-c'
       },
       ref : ['string'],
       refA : 'sd'
       //f:''
   }

   export type rrr = ExtractReadOnly<RawSchema.ColLeftRawSchema>

   export type rr2r = ExtractNonReadOnly<RawSchema.ColLeftRawSchema>

   // Both work including if there is no inheretance.
   const modeEnhancedlColLeft = new colLeft(recordColLeftValue);
   modeEnhancedlColLeft =''    // Invalidate there should only be string methods avaliable.

   modeEnhancedlColLeft.save((err, model) => {
       type test = typeof model;

      
       model.populate({path:'refA', select : "y"})

       model.save((err, model) => {

           model.populate({path:'refA', select : ("") => 'refC' });

       });
   });

   type WrapAsObjectKey<K> = {K}


type res = TransformPartial<RawSchema.ColLeftRawSchema, 'ref'>;

const res : res
res.ref = ''

colLeft.findById('').lean(false).populate('refA').populate('refA').exec(function(err,result)
{
   result.refA. = 'Y-1'
});



colLeft.findById('').lean(false)
//.populate('ref')
.exec(function(err, results)
{
   results.populate('ref', function(err, results){
       results.populate('ref').populate('refA').save(function(err,result)
      
       {
           result.ref.toString();
           result.refA
       }
   })
});


   // colLeft.findById({},(err,model) => {
   //     model.
   // }

   //colLeft.findById({}).lean(true).exec()


   // I actually don't like this because can assign the incorrect shit, it not actually
   // as good idear as we have tought.
   export ColRightRawSchema = ColLeftRawSchemareadOnly
*/
   export interface IDocumentModel
   {
       id: string;
   }
   export type IDocumentModelOptional = {}
  

   export interface ISchemaShape<T = any>
   {
       _id: T
   }

   export interface IRefType<T> {
       ___RefType: T
   }

   export interface IPlainType<T> {
       ___PlainType: T
   }

   export interface IReadOnly<T> {
       ___ReadOnly: T
   }

   export type RefIdType = string;

   export type ExtractReadOnly<T extends Record<string,any>> = Pick<T,ExtractReadOnlyKeys<T>>

   export type ExtractReadOnlyKeys<T extends Record<string,any>> =
   {
       [K in keyof T] : T[K] extends IReadOnly<any> ? K : never
   }[keyof T]

   export type ExtractNonReadOnly<T extends Record<string,any>> = Pick<T,ExtractNonReadOnlyKeys<T>>

   export type ExtractNonReadOnlyKeys<T extends Record<string,any>> =
   {
       [K in keyof T] : T[K] extends IReadOnly<any> ? never : K
   }[keyof T]

   export type PathSpec = 'id' | 'never' | Record<string, any>;

   export type TransformRef<Ref extends Record<string, any>, PathInfo extends PathSpec>
       =
       Ref extends IPlainType<infer plainType> | undefined ? plainType :

       PathInfo extends Record<string, any>
           ? TransformRaw<Ref, PathInfo>
       : PathInfo extends 'id'
           ? RefIdType
       : never;

   export type KeyExists<ObjType extends Record<string, any>, Key extends string, True, False>
       = Key extends keyof ObjType ? True : False;

   export type Transform<T extends Record<string,any>, Paths extends ExtractTranformValidate<T,Paths>> =
       TransformRaw<T, Paths>

   export type TransformRaw<T extends Record<string, any>, Paths extends Record<string, any>> = {
   [K in keyof T]:
       T[K] extends IPlainType<infer plainType> | undefined ? plainType
      
       : T[K] extends IRefType<Array<infer ArrayRef>> | undefined
       ? KeyExists<Paths, K, TransformRef<ArrayRef, Paths[K]>[], Array<RefIdType | TransformRef<ArrayRef,{}>>>
       //
       : T[K] extends IRefType<infer Ref> | undefined
       ? KeyExists<Paths, K, TransformRef<Ref, Paths[K]>, RefIdType | TransformRef<Ref,{}>>
       // This could be an array single type or object..
       : T[K] extends Array<infer Elem> | undefined
       ? KeyExists<Paths, K, TransformRef<Elem, Paths[K]>[], TransformRef<Elem, {}>[]>
       // The key may existing in the path, but not nessarly correct
       : T[K] extends Record<string, any> | undefined
       ? KeyExists<Paths, K, TransformRaw<T[K], Paths[K]>, TransformRaw<T[K], {}>>

       : T[K] extends Record<string, any> | undefined
       ? KeyExists<Paths, K, TransformRaw<T[K], Paths[K]>, TransformRaw<T[K], {}>>

       : T[K]
   };

   export type PickTransformRef<Ref extends Record<string, any>, PathInfo extends PathSpec>
   =
   Ref extends IPlainType<infer plainType> | undefined ? plainType :

   PathInfo extends Record<string, any>
       ? PickSubTransformRaw<Ref, PathInfo>
   : PathInfo extends 'id'
       ? RefIdType
   : never;

   export type PickKeyExists<ObjType extends Record<string, any>, Key extends string, True, False>
       = Key extends keyof ObjType ? True : False;

   export type PickTransform<T extends Record<string,any>, Paths extends ExtractTranformValidate<T,Paths>> =
       TransformRaw<T, Paths>

   export type PickSubTransformRaw<T extends Record<string, any>, Paths extends Record<string, any>> = {
   [K in keyof T]:
       T[K] extends IPlainType<infer plainType> | undefined ? plainType
      
       : T[K] extends IRefType<Array<infer ArrayRef>> | undefined
       ? KeyExists<Paths, K, PickTransformRef<ArrayRef, Paths[K]>[], Array<RefIdType | PickTransformRef<ArrayRef,{}>>>
       //
       : T[K] extends IRefType<infer Ref> | undefined
       ? KeyExists<Paths, K, PickTransformRef<Ref, Paths[K]>, RefIdType | PickTransformRef<Ref,{}>>
       // This could be an array single type or object..
       : T[K] extends Array<infer Elem> | undefined
       ? KeyExists<Paths, K, PickTransformRef<Elem, Paths[K]>[], PickTransformRef<Elem, {}>[]>
       // The key may existing in the path, but not nessarly correct
       : T[K] extends Record<string, any> | undefined
       ? KeyExists<Paths, K, PickSubTransformRaw<T[K], Paths[K]>, PickSubTransformRaw<T[K], {}>>

       : T[K] extends Record<string, any> | undefined
       ? KeyExists<Paths, K, PickSubTransformRaw<T[K], Paths[K]>, PickSubTransformRaw<T[K], {}>>

       : T[K]
   };


   export type PickTransformRaw<T extends Record<string, any>, Paths extends Record<string, any>,
   Transformed = PickSubTransformRaw<T, Paths>
   > = Pick<Transformed, { [K in keyof T] : K extends keyof Paths ? K
                       : T[K] extends IRefType<infer refType> | undefined ? never : K
   }[keyof Transformed]>

   // export type re = 'g' extends keyof {} ? 'T' : 'F'

   // type PickResults = PickTransformRaw<IFinancialProductModSchema,{documentRequirements:{documentTypes:{}}}>

   // let pickResults : PickResults;
   // pickResults = {} as TransformRaw<IFinancialProductModSchema,{company:{},documentRequirements:{documentTypes:{}}}>

   // pickResults
  
   // //pickResults.documentRequirements[0].documentTypes[0].
  
   // let test  = {} as  Schemas.IFinancialProductSchema;
   // let results = {} as Schemas.IFinancialProductSchema<{documentRequirements:{documentTypes:{}}}>;
   // //type testing = typeof test.documentRequirements[0].
   // //results.

   // //test = results;

   // const rrr = {} as TransformRaw<IFinancialProductModSchema,{company:{},documentRequirements:{documentTypes:{}}}>;
   // rrr.documentRequirements[0].documentTypes[0]

   // type Financial<Paths extends Record<string,any>> = TransformRaw<IFinancialProductModSchema, Paths>

   // // PickTransformRaw<IFinancialProductModSchema, Paths>
   // {

   // }


   export type TransformPartialRefRaw<Ref extends Record<string, any>, PathInfo extends PathSpec>
       = Ref extends IPlainType<infer plainType> | undefined ? Ref :

       PathInfo extends Record<string, any>
           ? TransformPartialRaw<Ref, PathInfo>
       : Ref


   export type TransformPartialRaw<T extends Record<string, any>, Paths extends Record<string, any>> = {
       [K in keyof T]:
           T[K] extends IPlainType<infer plainType> | undefined ? T[K]
          
           : T[K] extends IRefType<Array<infer ArrayRef>> | undefined
           ? KeyExists<Paths, K, TransformPartialRefRaw<ArrayRef, Paths[K]>[], T[K]>
           //
           : T[K] extends IRefType<infer Ref> | undefined
           ? KeyExists<Paths, K, TransformPartialRefRaw<Ref, Paths[K]>, T[K]>
           // This could be an array single type or object..
           : T[K] extends Array<infer Elem> | undefined
           ? KeyExists<Paths, K, TransformPartialRefRaw<Elem, Paths[K]>[], T[K]>
           // The key may existing in the path, but not nessarly correct
           : T[K] extends Record<string, any> | undefined
           ? KeyExists<Paths, K, TransformPartialRaw<T[K], Paths[K]>, T[K]>
  
           : T[K] extends Record<string, any> | undefined
           ? KeyExists<Paths, K, TransformPartialRaw<T[K], Paths[K]>, T[K]>
  
           : T[K]
       };

   export type ExtractIRefKeys<T extends Record<string,any>> = {
       [K in keyof T] : T[K] extends IRefType<any> ? K : never
   }[keyof T]

   export type ExtractTranformValidate<T extends any, Keys extends Record<string,any>,
    TKeys = keyof Keys,
    TRefKeys extends string = ExtractIRefKeys<T>,
    TTransformed = TransformPartial<T,keyof Keys>
    > =
    {
       [K in keyof TTransformed]? :
           K extends TKeys ?
               Keys[K] extends Record<string,never> ?
                   Record<string,never> 
               : Keys[K] extends 'id' ?
                   K extends TRefKeys ? 'id' : never
               : Keys[K] extends 'never' ?
                   K extends TRefKeys ? 'never' : never
             
               : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
                   : TTransformed[K] extends IPlainType<any> | undefined ? never
                   : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
                   : TTransformed[K] extends IRefType<any> | undefined ? 'should never happen'
                   : TTransformed[K] extends Array<infer Arr> | undefined ?
                       ExtractTranformValidate<Arr,Keys[K]>
                       : ExtractTranformValidate<TTransformed[K],Keys[K]>
                      
           : never 
   }
/*
   export type ExtractTranformValidate<T extends any, Keys extends Record<string,any>,
    TKeys = keyof Keys,
    TRefKeys extends string = ExtractIRefKeys<T>,
    TTransformed = TransformPartial<T,keyof Keys>
    > =
    {
       [K in keyof TTransformed]? :
           K extends TKeys ?
               Keys[K] extends Record<string,never> ?
                   Record<string,never> 
               : Keys[K] extends 'id' ?
                   K extends TRefKeys ? 'id' : never
               : Keys[K] extends 'never' ?
                   K extends TRefKeys ? 'never' : never

               : K extends TRefKeys ?
                   TTransformed[K] extends Array<IRefType<infer Arr>> | undefined ?
                       't'//ExtractTranformValidate<Arr,Keys[K]>
                   : TTransformed[K] extends IRefType<infer refType> | undefined ?
                       'g'//ExtractTranformValidate<refType,Keys[K]>
                       : 'j'//never
               : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
                   : TTransformed[K] extends IPlainType<any> | undefined ? never
                   : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
                   : TTransformed[K] extends Array<infer Arr> | undefined ?
                       ExtractTranformValidate<Arr,Keys[K]>
                       : ExtractTranformValidate<TTransformed[K],Keys[K]>
           : never 
   }
*/
   export type ExtractPickValidate<T extends any, Keys extends Record<string,any>,
   TKeys = keyof Keys,
   TTransformed = TransformPartial<T,keyof Keys>
   > =
   {
      [K in keyof TTransformed]? :
          K extends TKeys ?
               Keys[K] extends Record<string,never> ?
                  Record<string,never> 
  
               : TTransformed[K] extends IPlainType<any> | undefined ? never
               : TTransformed[K] extends Array<IPlainType<any>>  | undefined ? never
                  : TTransformed[K] extends IPlainType<any> | undefined ? never
                  : TTransformed[K] extends Array<IPlainType<any>> | undefined ? never
                  : TTransformed[K] extends Array<IRefType<infer Arr>> | undefined ?
                       Record<string,never> | 'id'
                   : TTransformed[K] extends Array<infer Arr> | undefined?
                       ExtractPickValidate<Arr,Keys[K]>
                      : ExtractPickValidate<TTransformed[K],Keys[K]>
          : never 
   }

   export type TransformPartialRef<Ref extends Record<string, any>, PathInfo extends PathSpec>
       = Ref extends IPlainType<infer plainType> | undefined ? Ref :

       PathInfo extends Record<string, any>
           ? TransformRaw<Ref, PathInfo>
       : Ref

   export type TransformPartial<T extends Record<string, any>, Key extends string> = {
       [K in keyof T]:
           T[K] extends IPlainType<infer plainType> | undefined ? T[K]
          
           : T[K] extends IRefType<Array<infer ArrayRef>> | undefined
           ? K extends Key ? ArrayRef [] : T[K]
           //
           : T[K] extends IRefType<infer Ref> | undefined
           ? K extends Key ? Ref : T[K]
           //
           : T[K] extends Array<infer Elem> | undefined
           ? K extends Key ? Elem [] : T[K]
           //
           //: T[K] extends Record<string, any>
           //? KeyExistsIter<Paths, K, TransformRaw<T[K], Paths['Iter']>, T[K]>
           : T[K]
       };

   //     export type TransformPartialPathRef<Ref extends Record<string, any>, PathInfo extends PathSpec>
   //     = Ref extends IPlainType<infer plainType> ? Ref :
   //     PathInfo extends Record<string, any>
   //         ? TransformRaw<Ref, PathInfo>
   //     : Ref

   // export type TransformPartialPath<T extends Record<string, any>, Paths extends PopulateOptionsBase<any,any>,
   //  PathKey extends keyof Paths = 'path', iter extends keyof Paths= 'options',
   //  Key = Paths[PathKey]> = {
   //     [K in keyof T]:
   //         T[K] extends IPlainType<infer plainType> ? T[K]
          
   //         : T[K] extends IRefType<Array<infer ArrayRef>>
   //         ? K extends Key ? ArrayRef [] : T[K] []
   //         //
   //         : T[K] extends IRefType<infer Ref>
   //         ? K extends Key ? Ref : T[K]
   //         //
   //         : T[K] extends Array<infer Elem>
   //         ? K extends Key ? Elem [] : T[K]
   //         //
   //         //: T[K] extends Record<string, any>
   //         //? KeyExistsIter<Paths, K, TransformRaw<T[K], Paths['Iter']>, T[K]>
   //         : T[K]
   //     };


   // export interface TransformIter<Key extends string, Iter extends TransformIter<any,any> | {} = {}>
   // {
   //     Key : Key,
   //     Iter : Iter
   // }

   // export type KeyExistsIter<Iter extends TransformIter<any,any>, Key extends string, True, False>
   //     = Key extends Iter['Key'] ? True : False;

   // export type TransformPartialRef<Ref extends Record<string, any>, PathInfo extends PathSpec>
   //     = Ref extends IPlainType<infer plainType> ? Ref :
   //     PathInfo extends Record<string, any>
   //         ? TransformRaw<Ref, PathInfo>
   //     : Ref

   // export type TransformPartial<T extends Record<string, any>, Paths extends TransformIter<any,any>> = {
   //     [K in keyof T]:
   //         T[K] extends IPlainType<infer plainType> ? T[K]
          
   //         : T[K] extends IRefType<Array<infer ArrayRef>>
   //         ? KeyExistsIter<Paths, K, TransformPartialRef<ArrayRef, Paths['Iter']>[], T[K]>
   //         //
   //         : T[K] extends IRefType<infer Ref>
   //         ? KeyExistsIter<Paths, K, TransformPartialRef<Ref, Paths['Iter']>, T[K]>
          
   //         // This could be an array single type or object..
   //         : T[K] extends Array<infer Elem>
   //         ? KeyExistsIter<Paths, K, TransformPartialRef<Elem, Paths['Iter']>[], T[K]>
   //         // The key may existing in the path, but not nessarly correct
   //         : T[K] extends Record<string, any>
   //         ? KeyExistsIter<Paths, K, TransformRaw<T[K], Paths['Iter']>, T[K]>
   //         : T[K]
   //     };

   export type ISchemaRawShape = Record<string, any>

   export type ExtractType<O extends any, K extends string> = O[K]

   export  interface PopulateOptionsBase<Path, Select>
   {
       path :  Path
       select? : Select
       options? : any
   }

   export type ObjectGetValue<O extends Record<string,any>, K extends string> = O[K]

   export type ExtractPopulateOption<SchemaPartial extends Record<string,any>, T extends PopulateOptionsBase<any,any>,
   Path extends string = T['path'],
   Select extends string | undefined = T['select'],
    > = {
       path : keyof SchemaPartial
       select? : keyof ObjectGetValue<TransformPartial<SchemaPartial,Path>,Path> |
                   ((i:string) => keyof ObjectGetValue<TransformPartial<SchemaPartial,Path>,Path>)
       options? : Select extends undefined ? ExtractPopulateOption<TransformPartial<SchemaPartial,Path>,T['options']>
                       : Select extends keyof ObjectGetValue<TransformPartial<SchemaPartial,Path>,Path> ?
                       ExtractPopulateOption<Pick<ObjectGetValue<TransformPartial<SchemaPartial,Path>,Path>,Select> ,T['options']>
                   : never
       model?: string;
       match?: Object;
   }

   // these helps are first level helpers.
   // populate options need second level helpers.

   export type ObjectKeysToUnionString<T extends Record<string,any>> =
   {
       [K in keyof T] : K
   }[keyof T]

/*
   export function oKeysToSpacedValue<Schema extends Record<string,any>,
   Doc extends DocumentEnhanced<any,any,  SchemaPartial,any>
   ,
   OKeys extends keyof Schema>(doc : Doc, object :OKeys) : ObjectKeysToUnionString<OKeys> {

       return Object.keys(object).join(' ') as any;
   }

   export type ExtractArrayItems<T> = ObjectOmit<T, keyof Array<never>>

   export type ArrayToUnionString<T extends Array<string>> = T[keyof ExtractArrayItems<T>]

   export function spacedValue<A extends Array<string>>(values : A) : ArrayToUnionString<A> {
       return values.join(' ') as any
   }
*/
   declare module 'mongoose'
   {
       function model<RawSchema extends ISchemaRawShape,     
           SchemaReadOnly extends Record<string, any>>
           (name: string, schema?: Schema, collection?: string, skipInit?: boolean): ModelEnhanced<RawSchema, TransformRaw<SchemaReadOnly,{}>>;

       export module Types {
  
           interface ObjectId
           {
               toString: () => string;  
           }
       }
   }


   export interface TModelEnhanced<RawSchema extends ISchemaRawShape> extends ModelInternal<RawSchema, any, any,any, any>
   {
   }


   export type ModelEnhanced<RawSchema extends ISchemaRawShape,
   //  These are fields, which the data base has defaults for,
   // that are never ment to be update after record creation       
   SchemaReadOnly extends Record<string, any> = {}> =
    ModelInternal<RawSchema, SchemaReadOnly>
    // & MonModel<TransformRaw<RawSchema,{}> & Document>

   export type SchemaNewRecord<Schema extends Record<string,any>> =  ObjectOmit<Schema,'_id'> & Partial<Pick<Schema,'_id'>> & IDocumentModelOptional 
  
   export interface ModelInternal<
       RawSchema extends ISchemaRawShape,
       //  These are fields, which the data base has defaults for,
       // that are never ment to be update after record creations       
       SchemaReadOnly extends Record<string, any> = {},
        // Optionals are not required to be spesified.
       SchemaPartial extends ISchemaRawShape = RawSchema,
       Schema extends Record<string,any> = TransformRaw<RawSchema, {}>,
       SchemaNewRecordModel = Schema & DocumentNewEnhanced<RawSchema, SchemaReadOnly, SchemaPartial> & IDocumentModel,
       SchemaResultModel = Schema & SchemaReadOnly & SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, SchemaPartial> & IDocumentModel,
       > {

           newType : SchemaNewRecord<Schema>;
           new(doc?: SchemaNewRecord<Schema>, fields?: Object, skipInit?: boolean): SchemaNewRecordModel;

           // This is required to overide the underlying hidden Model, in less you feel like copy and pasting everything to this level.
           new(doc?: Object, fields?: Object, skipInit?: boolean): 'Invalid Record' & void;

           // deep populate now just stops everything else, need to implemented a look at head
           // Record<string, any> = > Record<string,Record<string(dontcare),Record<string,any>>
           deepPopulate<Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(paths: string) :
           QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>>;

           deepPopulate<Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(paths: Array<string>) :
           QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>>;
            create(doc: SchemaNewRecord<Schema>, fn?: (err: any, res: SchemaNewRecordModel) => void): Promise<SchemaNewRecordModel>;
           create(doc1: SchemaNewRecord<Schema>, doc2: SchemaNewRecord<Schema>, fn?: (err: any, res1: SchemaNewRecordModel, res2: SchemaNewRecordModel) => void): Promise<SchemaNewRecordModel[]>;
           create(doc1: SchemaNewRecord<Schema>, doc2: SchemaNewRecord<Schema>, doc3: SchemaNewRecord<Schema>, fn?: (err: any, res1: SchemaNewRecordModel, res2: SchemaNewRecordModel, res3: SchemaNewRecordModel) => void): Promise<SchemaNewRecordModel[]>;
          
           // Not finished...
           // distincts are lean in the callback by definition
           distinct<K extends keyof Schema>(field: K, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>;
           distinct<K extends keyof Schema = never>(field: string, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>;
           distinct<K extends keyof Schema>(field: K, conditions: Object, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>
           distinct<K extends keyof Schema = never>(field: string, conditions: Object, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K][],{},Schema[K][]>;

           aggregate<X>(...aggregations: Object[]): Aggregate<X[]>;
           aggregate<X>(aggregation: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
           aggregate<X>(aggregation1: Object, aggregation2: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;
           aggregate<X>(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: X[]) => void): Promise<X[]>;

           aggregate(...aggregations: Object[]): 'Invalid Record' & void;
           aggregate(aggregation: Object, callback: (err: any, res: any[]) => void): 'Invalid Record' & void;
           aggregate(aggregation1: Object, aggregation2: Object, callback: (err: any, res: any[]) => void): 'Invalid Record' & void;
           aggregate(aggregation1: Object, aggregation2: Object, aggregation3: Object, callback: (err: any, res: any[]) => void): 'Invalid Record' & void;
          

           findById(id: string, callback?: (err: any, res: SchemaResultModel) => void)
               : QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial>;
                  
           find(): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A'>;
           // I haven't taken the array wrapping into arroud for transform, I will need to strip that.
           find(cond: Object, callback?: (err: any, res: SchemaResultModel[]) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A'>;
           find(cond: Object, fields: Object, callback?: (err: any, res: SchemaResultModel[]) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A'>;
           find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: SchemaResultModel[]) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A'>;
           findById(id: ObjectGetValue<Schema,'_id'>, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findById(id: ObjectGetValue<Schema,'_id'>, fields: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findById(id: ObjectGetValue<Schema,'_id'>, fields: Object, options: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findByIdAndRemove(id: ObjectGetValue<Schema,'_id'>, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findByIdAndRemove(id: ObjectGetValue<Schema,'_id'>, options: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findByIdAndUpdate(id: ObjectGetValue<Schema,'_id'>, update: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findByIdAndUpdate(id: ObjectGetValue<Schema,'_id'>, update: Object, options: FindAndUpdateOption, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findOne(cond?: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findOne(cond: Object, fields: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findOne(cond: Object, fields: Object, options: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findOneAndRemove(cond: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findOneAndRemove(cond: Object, options: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findOneAndUpdate(cond: Object, update: Object, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           findOneAndUpdate(cond: Object, update: Object, options: FindAndUpdateOption, callback?: (err: any, res: SchemaResultModel) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
      
           //populate<U>(doc: U, options: Object, callback?: (err: any, res: U) => void): Promise<U>;
           //populate<U>(doc: U[], options: Object, callback?: (err: any, res: U[]) => void): Promise<U[]>;

           // These schema may need to change but I will have to look that up.
           update(cond: Object, update: Object, callback?: (err: any, affectedRows: number, raw: any) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           update(cond: Object, update: Object, options: Object, callback?: (err: any, affectedRows: number, raw: any) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
           remove(cond: Object, callback?: (err: any) => void): Query<{}>;

           save(callback?: (err: any, result: SchemaResultModel, numberAffected: number) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
          
           // Need to look into this.
           //where(path: string, val?: Object): Query<T[]>;

           count(callback?: (err: any, count: number) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, {Primative:number}, 'O', 'P'>;

           count(criteria: Object, callback?: (err: any, count: number) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, {Primative: number}, 'O', 'P'>;

           $where(condition?: string):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;

           $where(funCondition: (this: (TransformRaw<SchemaPartial,{}>)) => bool):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;
   }


  
      
   export type QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults extends 'A' | 'O', Primative extends 'P' | 'S',
    Lean extends 'T' | 'F', SchemaPartial, Schema> =
           Lean extends 'T' ?
               Primative extends 'P' ?
                   ObjectGetValue<Schema,'Primative'>
                   : ArrayOfResults extends 'O' ?
                       Schema & SchemaReadOnly
                   : Array<Schema & SchemaReadOnly>
           : ArrayOfResults extends 'O' ?
               Primative extends 'P' ?
                   ObjectGetValue<Schema,'Primative'> & DocumentEnhanced<RawSchema, SchemaReadOnly, SchemaPartial> & IDocumentModel
                   : Schema & SchemaReadOnly & DocumentEnhanced<RawSchema, SchemaReadOnly, SchemaPartial> & IDocumentModel
               : Array<Schema & SchemaReadOnly & DocumentEnhanced<RawSchema, SchemaReadOnly, SchemaPartial> & IDocumentModel>

   export type ObjectValue<T, K> = T extends Record<string,any> ? K extends keyof T ? T[K] : T : T

   export type ObjectKeyPick<O extends Record<string,any> ,Key extends keyof O, Keys extends keyof O[Key]> = {
   [K in keyof O] : K extends Key ?
       O[K] extends Array<infer Arr> ? Pick<O[K],Keys> []
       : Pick<O[K],Keys>
   : O[K]
   }

   export type QueryEnhanced<
   RawSchema extends ISchemaRawShape,
   SchemaReadOnly extends Record<string, any>,
   SchemaPartial extends ISchemaRawShape | {Primative:any} = RawSchema,
   ArrayOfResults extends 'A' | 'O' = 'O',
   Primative extends 'P' | 'S' = 'S',
   Lean extends 'T' |'F' = 'F',
   > =  QueryInternal<RawSchema, SchemaReadOnly,SchemaPartial, ArrayOfResults, Primative, Lean>
   //& Query<TransformModel<RawSchema,{}> & Document>

   export interface QueryInternal<
       RawSchema extends ISchemaRawShape,
       SchemaReadOnly extends Record<string, any> = {},
       SchemaPartial extends ISchemaRawShape | {Primative:any} = RawSchema,
       ArrayOfResults extends 'A' | 'O' = 'O',
       Primative extends 'P' | 'S' = 'S',
       Lean extends 'T' |'F' = 'F',
       Schema extends Record<string,any> = TransformRaw<SchemaPartial,{}>>
   {
       lean() : QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, ArrayOfResults, Primative ,'T'>;
       lean(value : true) : QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, ArrayOfResults, Primative, 'T'>;
       lean(value : false) : QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, ArrayOfResults, Primative, 'F'>;
       lean(value : undefined) : QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, ArrayOfResults, Primative, 'F'>;

       exec(callback?: (err: any, res: QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>) => void):
        Promise<QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>>;
       exec(operation: string, callback?: (err: any, res: QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>) => void):
        Promise<QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>>;
       exec(operation: Function, callback?: (err: any, res: QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>) => void):
        Promise<QueryResultsDocumentModel<RawSchema, SchemaReadOnly, ArrayOfResults, Primative, Lean, SchemaPartial, Schema>>;

       populate<K extends keyof SchemaPartial, Sel extends keyof TransformPartial<SchemaPartial,K>[K]>
       (path: K, select: Sel, match?: Object, options?: Object):
        QueryEnhanced<RawSchema, {}, ObjectKeyPick<TransformPartial<SchemaPartial,K>,K,Sel>, ArrayOfResults, Primative, Lean>;

       populate<K extends keyof SchemaPartial>(path: K, select: undefined, match?: Object, options?: Object):
        QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>, ArrayOfResults, Primative, Lean>;

       populate<K extends keyof SchemaPartial, Sel extends keyof TransformPartial<SchemaPartial,K>[K]>(path: K, select: string, match?: Object, options?: Object):
        QueryEnhanced<RawSchema, SchemaReadOnly, ObjectKeyPick<TransformPartial<SchemaPartial,K>,K,Sel>, ArrayOfResults, Primative, Lean>;

       populate<K extends keyof SchemaPartial>(path: K, select?: undefined, match?: Object, options?: Object):
        QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>, ArrayOfResults, Primative, Lean>;

       // still required to write a partial conversion form of this.
       populate<Which extends 'neasted', Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(path: string, select?: undefined, match?: Object, options?: Object):
        QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>, ArrayOfResults, Primative, Lean>;

       populate<Opt extends ExtractPopulateOption<Schema,Opt>>(opt: Opt):
       QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,ObjectGetValue<Opt,'Path'>>, ArrayOfResults, Primative, Lean>;
       
       // Still required to write a partial version of this.
       //populate<Opt extends ExtractPopulateOption<SchemaPartial,Opt>>(opt: Opt,
         //  callback?: (err: any, res: any) => void): any

       // deep populate now just stops everything else, need to implemented a look at head
       // Record<string, any> = > Record<string,Record<string(dontcare),Record<string,any>>
       deepPopulate<Paths extends ExtractTranformValidate<Schema,Paths>>(paths: string) :
        QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>, ArrayOfResults, Primative, Lean>;

        deepPopulate<Paths extends ExtractTranformValidate<Schema,Paths>>(paths: Array<string>) :
        QueryEnhanced<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>, ArrayOfResults, Primative, Lean>;

      
        //  QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, ArrayOfResults ,'T'>;

       //  distinct(callback?: (err: any, res: T) => void): Query<T>;
       //  distinct(field: string, callback?: (err: any, res: T) => void): Query<T>;
       //  distinct(criteria: Object, field: string, callback?: (err: any, res: T) => void): Query<T>;
       //  distinct(criteria: Query<T>, field: string, callback?: (err: any, res: T) => void): Query<T>;
      

       distinct<K extends keyof Schema>(field: K, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K], 'A', Primative, Lean>;
       distinct<K extends keyof Schema = never>(field: string, callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K],'A', Primative, Lean>;
      
       distinct<K extends keyof Schema>(conditions: Object,field: K,callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K],'A', Primative, Lean>
       distinct<K extends keyof Schema = never>(conditions: Object, field: string,  callback?: (err: any, res: Schema[K][]) => void): QueryEnhanced<Schema[K],{},Schema[K],'A', Primative, Lean>;

       find(callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'A', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A', Primative, Lean>;
       find(criteria: Object, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'A', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'A', Primative, Lean>;
       findOne(callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       findOne(criteria: Object, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative,  Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       findOneAndRemove(callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative,  Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative,  Lean>;
       findOneAndRemove(cond: Object, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       findOneAndRemove(cond: Object, options: Object, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       findOneAndUpdate(callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       findOneAndUpdate(update: Object, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       findOneAndUpdate(cond: Object, update: Object, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       findOneAndUpdate(cond: Object, update: Object, options: FindAndUpdateOption, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
      
       // PRIMATIVE OPTION REQUIRED, TAKE SUBKEY PARAMETER
       //limit(val: number): Query<T>;
      
       remove(callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O',Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
      
       remove(criteria: Object, callback?: (err: any, res:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
      
       sort(arg: Object): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       sort(arg: string): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
      
       update(callback?: (err: any, affectedRows: number, doc:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
      
       update(doc: Object, callback?: (err: any, affectedRows: number, doc:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
      
       update(criteria: Object, doc: Object, callback?: (err: any, affectedRows: number, doc:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
      
       update(criteria: Object, doc: Object, options: Object, callback?: (err: any, affectedRows: number, doc:
           QueryResultsDocumentModel<RawSchema, SchemaReadOnly, 'O', Primative, Lean, SchemaPartial, Schema>) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;


       count(callback?: (err: any, count: number) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, {Primative:number}, 'O', 'P', Lean>;
      
       count(criteria: Object, callback?: (err: any, count: number) => void):
           QueryEnhanced<RawSchema, SchemaReadOnly, {Primative: number}, 'O', 'P', Lean>;
      
       limit(val: number): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

       select<K extends keyof SchemaPartial>(arg: K):
           QueryEnhanced<RawSchema, SchemaReadOnly, {Primative:Pick<SchemaPartial, K> & {_id:ObjectGetValue<SchemaPartial, '_id'>}}, 'O', 'P', Lean>;

       select<Paths extends ExtractTranformValidate<Schema,Paths>>(arg: string):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

       select<Paths extends ExtractTranformValidate<Schema,Paths>>(arg: Object):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>

       where(path?: string, val?: any):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       where(path?: Object, val?: any):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

       gt(val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       gt(path: string, val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       gte(val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       gte(path: string, val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       lt(val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       lt(path: string, val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       lte(val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       lte(path: string, val: number):
           QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

       // Typicaly these need to be check that they have been preceed by some previous operation.
       // this woudl require nother parameter.
       equals(val: Object): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

       exists(val?: boolean): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;
       exists(path: string, val?: boolean): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O', Primative, Lean>;

       $where(condition?: string):
       QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;

       $where(funCondition: (this: (TransformRaw<SchemaPartial,{}>)) => bool):
       QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial, 'O'>;

       /*
       lt(val: number): Query<T>;
       lt(path: string, val: number): Query<T>;
       lte(val: number): Query<T>;
       lte(path: string, val: number): Query<T>;
       */
   }

   export type SchemaResultsDocumentModel<
   RawSchema extends ISchemaRawShape,
   SchemaReadOnly extends Record<string, any>,
   SchemaPartial extends ISchemaRawShape> =
   TransformRaw<SchemaPartial,{}> & SchemaReadOnly & (DocumentEnhanced<RawSchema, SchemaReadOnly, SchemaPartial> & IDocumentModel)

   export interface DocumentNewEnhanced<
       RawSchema extends ISchemaRawShape,
       SchemaReadOnly extends Record<string, any> = {},
       SchemaPartial extends ISchemaRawShape = RawSchema,
       Schema = TransformRaw<SchemaPartial,{}>>
   {
       save(callback?: (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, SchemaPartial>) => void): void;

       equals<docType extends Schema>(doc: docType): boolean;

       // Think the following should stil be relavent to newaly create records.
       invalidate<K extends keyof Schema>(path: K, errorMsg: string, value: any): void;
       invalidate<K extends keyof Schema>(path: K, error: Error, value: any): void;

       invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, errorMsg: string, value: any): void;
       invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, error: Error, value: any): void;

       set<K extends keyof Schema>(path: K, val: Schema[K], options?: Object): void;
       set<Paths extends ExtractPickValidate<Schema,Paths>> (path: string, val: any, options?: Object): void;
       set<Paths extends Record<string,any>, Missing extends 'Missing Field'> (path: string, val: any, options?: Object): void;
       set(value: Partial<Schema>): void;

       validate(cb: (err: any) => void): void;
  
       isNew: boolean;
       errors: Object;
       schema: Object;
   }

   export interface DocumentEnhanced<
       RawSchema extends ISchemaRawShape,
       SchemaReadOnly extends Record<string, any> = {},
       SchemaPartial extends ISchemaRawShape = RawSchema,
       Schema = TransformRaw<SchemaPartial,{}>,
   > //extends Document
   {
       save(callback?: (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, SchemaPartial>) => void): void;

       equals<docType extends Schema>(doc: docType): boolean;

       populate<K extends keyof Schema, OK extends IRefType<any>>(path: K, callback?:
           (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>>) => void):
           DocumentEnhanced<RawSchema, SchemaReadOnly, TransformPartial<SchemaPartial,K>>

       populate<Opt extends ExtractPopulateOption<SchemaPartial,Opt>>(opt: Opt,
           callback?: (err: any, res: any) => void): any

       // deep populate now just stops everything else, need to implemented a look at head
       // Record<string, any> = > Record<string,Record<string(dontcare),Record<string,any>>
       deepPopulate<Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(paths: string,
       callback?: (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>>) => void) : void
      
       deepPopulate<Paths extends ExtractTranformValidate<SchemaPartial,Paths>>(paths: Array<string>,
           callback?: (err: any, res: SchemaResultsDocumentModel<RawSchema, SchemaReadOnly, TransformPartialRaw<SchemaPartial,Paths>>) => void) : void   
      
       // QueryEnhanced<RawSchema, SchemaReadOnly, TransformRaw<SchemaPartial,Paths>, Lean>;

       remove<T>(callback?: (err: any) => void): QueryEnhanced<RawSchema, SchemaReadOnly, SchemaPartial>;

       update<T>(doc: Object, options: Object, callback: (err: any, affectedRows: number, raw: any) => void): QueryEnhanced<RawSchema, SchemaReadOnly>;

       toJSON(options?: Object): Schema & SchemaReadOnly;
       toObject(options?: Object): Schema & SchemaReadOnly;

       invalidate<Paths extends ExtractTranformValidate<Schema,Paths>>(path: string, errorMsg: string, value: any): void;
       invalidate<Paths extends ExtractTranformValidate<Schema,Paths>>(path: string, error: Error, value: any): void;

       invalidate(path: string, errorMsg: string, value: any): void;
       invalidate(path: string, error: Error, value: any): void;

       invalidate<K extends keyof Schema>(path: K, errorMsg: string, value: any): void;
       invalidate<K extends keyof Schema>(path: K, error: Error, value: any): void;

       invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, errorMsg: string, value: any): void;
       invalidate<Paths extends ExtractPickValidate<Schema,Paths>>(path: string, error: Error, value: any): void;

       set<K extends keyof Schema>(path: K, val: Schema[K], options?: Object): void;
       set<Paths extends ExtractPickValidate<Schema,Paths>> (path: string, val: any, options?: Object): void;
       set<Paths extends Record<string,any>, Missing extends 'Missing Field'> (path: string, val: any, options?: Object): void;
       set(value: Partial<Schema>): void;

       get<K extends keyof Schema>(path: string, type?: new(...args: any[]) => any): any;
       //get(path: string, type?: new(...args: any[]) => any): any;
   }

