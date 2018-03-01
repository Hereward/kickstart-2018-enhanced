declare module "meteor/react-meteor-data" {
  import * as React from "react";

  var withTracker: any;

  type ComponentConstructor<P> =
    | React.ComponentClass<P>
    | React.StatelessComponent<P>;

  export function createContainer<InP, D, OutP extends InP & D>(
    options: (
      props: InP
    ) => D | { getMeteorData: (props: InP) => D; pure?: boolean },
    reactComponent: ComponentConstructor<OutP>
  ): ComponentConstructor<InP>;
}

//declare var ReactQuill: any;

// declare var require: any

declare var Bert: any;

declare var process: any;

declare function dateFormat(date: any, options: any);

declare function swal(options: object);
//declare function ValidatedMethod(options:object);
declare var console: Console;
//declare var Accounts: any;

declare namespace Meteor.User {
  let verificationEmailSent: boolean;
}





//        profile?: Object;

/*
declare module "react-quill" {
  import * as React from "react";
  import * as Quill from "quill";

  export interface UnprivilegedEditor {
    getLength(): number;
    getText(index?: number, length?: number): string;
    getHTML(): string;
    getBounds(index: number, length?: number): Quill.BoundsStatic;
    getSelection(focus?: boolean): Quill.RangeStatic;
    getContents(index?: number, length?: number): Quill.DeltaStatic;
  }

  export interface ComponentProps {
    id?: string;
    className?: string;
    theme?: string;
    style?: React.CSSProperties;
    readOnly?: boolean;
    value?: string | Quill.Delta;
    defaultValue?: string | Quill.Delta;
    placeholder?: string;
    tabIndex?: number;
    bounds?: string | HTMLElement;
    onChange?: (
      content: string,
      delta: Quill.Delta,
      source: Quill.Sources,
      editor: UnprivilegedEditor
    ) => void;
    onChangeSelection?: (
      range: Quill.RangeStatic,
      source: Quill.Sources,
      editor: UnprivilegedEditor
    ) => void;
    onFocus?: (
      range: Quill.RangeStatic,
      source: Quill.Sources,
      editor: UnprivilegedEditor
    ) => void;
    onBlur?: (
      previousRange: Quill.RangeStatic,
      source: Quill.Sources,
      editor: UnprivilegedEditor
    ) => void;
    onKeyPress?: React.EventHandler<any>;
    onKeyDown?: React.EventHandler<any>;
    onKeyUp?: React.EventHandler<any>;
    formats?: string[];
    children?: React.ReactElement<any>;
    modules?: Quill.StringMap;

  }

  export default class Component extends React.Component<ComponentProps> {
    focus(): void;
    blur(): void;
    getEditor(): Quill.Quill;
	}
}
*/


declare module "meteor/accounts-base" {
  namespace Accounts {
    function createUser(
      options: {
        username?: string;
        email?: string;
        password?: string;
      },
      callback?: Function
    ): string;

    function verifyEmail(token: string, func: any): any;
    function sendVerificationEmail(id: string): any;
  }
}

declare module "meteor/meteor" {
  var process: any;
  namespace Meteor {
    interface User {
      _id?: string;
      username?: string;
      emails?: UserEmail[];
      createdAt?: number;
      profile?: any;
      services?: any;
      verificationEmailSent?: number;
      enhancedAuth: any;
    }
  }
}

declare module "meteor/mdg:validated-method" {
  class ValidatedMethod {
    constructor(properties: object);
    call(params: any, response: any): any;
  }
}

declare module "meteor/aldeed:simple-schema" {
  class SimpleSchema {
    constructor(properties: object);
    validator(): any;
  }
}

declare class ValidatedMethod {
  constructor(properties: object);
  call(params: any, response: any): any;
}

declare class SimpleSchema {
  constructor(properties: object);
  validator(): any;
}

declare module "meteor/accounts-base" {
  namespace Accounts {
    var urls: URLS;
    var emailTemplates: EmailTemplates;

    function forgotPassword(
      options: {
        email?: string;
      },
      callback?: Function
    ): void;

    function resetPassword(
      token: string,
      newPassword: string,
      callback?: Function
    ): void;
  }
}

declare var require: any;

// IntrinsicAttributes
//IntrinsicElements

/*
declare module JSX {
  interface IntrinsicAttributes {
    "fresh": any;
  }
}
*/

declare namespace JSX {
  interface IntrinsicElements {
    CustomTag: any;
    [elemName: string]: any;
  }
}

interface JQuery {
  /**
   * Remove the specified attributes from the first matched element and return them.
   *
   * @param attributes A space-separated list of attribute names to remove.
   */
  removeAttrs(attributes: string): any;
  /**
   * Adds the specified rules and returns all rules for the first matched element. Requires that the parent form is validated, that is, $( "form" ).validate() is called first.
   *
   * @param command "remove" or "add"
   * @param rules The rules to add. Accepts the same format as the rules-option of the validate-method.
   */
  rules(command: "add", rules?: JQueryValidation.RulesDictionary): any; // tslint:disable-line unified-signatures
  /**
   * Removes the specified rules and returns all rules for the first matched element.
   * @param command "remove"
   * @param rules The space-seperated names of rules to remove and return. If left unspecified, removes and returns all rules. Manipulates only rules specified via rules-option or via rules("add").
   */
  rules(command: "remove", rules?: string): any; // tslint:disable-line unified-signatures
  /**
   * Returns the validation rules for teh first selected element.
   */
  rules(): any;
  /**
   * Checks whether the selected form is valid or whether all selected elements are valid.
   */
  valid(): boolean;

  /**
   * Validates the selected form.
   *
   * @param options options for validation
   */
  validate(
    options?: JQueryValidation.ValidationOptions
  ): JQueryValidation.Validator;
}

// Meteor-Files

declare module "meteor/ostrio:files" {
  import { Mongo } from "meteor/mongo";
  import { ReactiveVar } from "meteor/reactive-var";

  class FileObj {
    size: number;
    name: string;
    type: string;
    path: string;
    isVideo: boolean;
    isAudio: boolean;
    isImage: boolean;
    isText: boolean;
    isJSON: boolean;
    isPDF: boolean;
    extension?: string;
    _storagePath: string;
    _downloadRoute: string;
    _collectionName: string;
    public?: boolean;
    meta?: Object;
    userid?: string;
    updatedAt?: Date;
    versions: Object;
  }

  type FileRef = any; // File record from Mongo DB... don't know the details yet

  interface FileData {
    size: number;
    type: string;
    mime: string;
    "mime-type": string;
    ext: string;
    extension: string;
    name: string;
  }

  interface FilesCollectionConfig {
    storagePath?: string;
    collection?: Mongo.Collection<any>;
    collectionName?: string;
    continueUploadTTL?: string;
    ddp?: Object;
    cacheControl?: string;
    responseHeaders?:
      | { [x: string]: string }
      | ((
          responseCode?,
          fileRef?,
          versionRef?,
          version?
        ) => { [x: string]: string });
    throttle?: number | boolean;
    downloadRoute?: string;
    schema?: Object;
    chunkSize?: number;
    namingFunction?: () => string;
    permissions?: number;
    parentDirPermissions?: number;
    integrityCheck?: boolean;
    strict?: boolean;
    downloadCallback?: (fileObj: FileObj) => boolean;
    protected?: boolean | ((fileObj: FileObj) => boolean | number);
    public?: boolean;
    onBeforeUpload?: (fileData: FileData) => boolean | string;
    onBeforeRemove?: (cursor: Mongo.Cursor<any>) => boolean;
    onInitiateUpload?: (fileData: FileData) => void;
    onAfterUpload?: (fileRef: FileRef) => any;
    onAfterRemove?: (files: Object[]) => any;
    onbeforeunloadMessage?: string | (() => string);
    allowClientCode?: boolean;
    debug?: boolean;
    interceptDownload?: (http: any, fileRef: any, version: string) => boolean;
  }

  export interface SearchOptions {
    sort?: Mongo.SortSpecifier;
    skip?: number;
    limit?: number;
    fields?: Mongo.FieldSpecifier;
    reactive?: boolean;
    transform?: Function;
  }

  export interface InsertOptions {
    file: File | Object | string;
    isBase64?: boolean;
    meta?: { [x: string]: any };
    transport?: "ddp" | "http";
    onStart?: (error: Object, fileData: Object) => any;
    onUploaded?: (error: Object, fileData: Object) => any;
    onAbort?: (fileData: Object) => any;
    onError?: (error: Object, fileData: Object) => any;
    onProgress?: (progress: number, fileData: Object) => any;
    onBeforeUpload?: (fileData: Object) => any;
    streams?: number | "dynamic";
    chunkSize?: number | "dynamic";
    allowWebWorkers?: boolean;
  }

  export interface LoadOptions {
    fileName: string;
    meta?: Object;
    type?: string;
    size?: number;
  }

  export class FileUpload {
    file: File;
    onPause: ReactiveVar<boolean>;
    progress: ReactiveVar<number>;
    estimateTime: ReactiveVar<number>;
    estimateSpeed: ReactiveVar<number>;
    state: ReactiveVar<"active" | "paused" | "aborted" | "completed">;

    pause();
    continue();
    toggle();
    pipe();
    start();
    on(event: string, callback: Function): void;
  }

  export class FileCursor extends FileObj {
    // Is it correct to say that it extends FileObj?
    remove(callback: (err) => void): void;
    link(): string;
    get(property: string): Object | any;
    fetch(): Object[];
    with(): ReactiveVar<FileCursor>;
  }

  export class FilesCursor extends Mongo.Cursor<FileObj> {
    cursor: Mongo.Cursor<FileObj>; // Refers to base cursor? Why is this existing?

    get(): Object[];
    hasNext(): boolean;
    next(): Object;
    hasPrevious(): boolean;
    previous(): Object;
    first(): Object;
    last(): Object;
    remove(callback: (err) => void): void;
    each(): FileCursor[];
    current(): Object | undefined;
  }

  export class FilesCollection {
    collection: Mongo.Collection<FileObj>;
    schema: any;

    constructor(config: FilesCollectionConfig);

    find(selector?: Mongo.Selector, options?: SearchOptions): FilesCursor;
    findOne(selector?: Mongo.Selector, options?: SearchOptions): FileCursor;
    insert(settings: InsertOptions, autoStart?: boolean): FileUpload;
    remove(select: Mongo.Selector, callback: (error) => any): FilesCollection;
    link(fileRef: FileRef, version?: string): string;
    allow(options: Mongo.AllowDenyOptions): void;
    deny(options: Mongo.AllowDenyOptions): void;
    denyClient(): void;
    on(event: string, callback: (fileRef: FileRef) => void): void;
    unlink(fileRef: FileRef, version?: string): FilesCollection;
    addFile(
      path: string,
      opts: LoadOptions,
      callback: (err: any, fileRef: FileRef) => any,
      proceedAfterUpload: boolean
    );
    load(
      url: string,
      opts: LoadOptions,
      callback: (err: any, fileRef: FileRef) => any,
      proceedAfterUpload: boolean
    );
    write(
      buffer: Buffer,
      opts: LoadOptions,
      callback: (err: any, fileRef: FileRef) => any,
      proceedAfterUpload: boolean
    );
  }
}
