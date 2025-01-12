import type { Blog } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { Resolver } from "@quramy/prisma-fabbrica/lib/internal";
export {
	resetSequence,
	registerScalarFieldValueGenerator,
	resetScalarFieldValueGenerator,
} from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions<TTransients extends Record<string, unknown>> = {
	readonly seq: number;
} & TTransients;
type TraitName = string | symbol;
type CallbackDefineOptions<
	TCreated,
	TCreateInput,
	TTransients extends Record<string, unknown>,
> = {
	onAfterBuild?: (
		createInput: TCreateInput,
		transientFields: TTransients,
	) => void | PromiseLike<void>;
	onBeforeCreate?: (
		createInput: TCreateInput,
		transientFields: TTransients,
	) => void | PromiseLike<void>;
	onAfterCreate?: (
		created: TCreated,
		transientFields: TTransients,
	) => void | PromiseLike<void>;
};
export declare const initialize: (
	options: import("@quramy/prisma-fabbrica/lib/internal").InitializeOptions,
) => void;
type BlogFactoryDefineInput = {
	id?: string;
	title?: string;
	content?: string;
	published?: boolean;
	userName?: string;
	userImage?: string;
	createdAt?: Date;
	updatedAt?: Date;
};
type BlogTransientFields = Record<string, unknown> &
	Partial<Record<keyof BlogFactoryDefineInput, never>>;
type BlogFactoryTrait<TTransients extends Record<string, unknown>> = {
	data?: Resolver<
		Partial<BlogFactoryDefineInput>,
		BuildDataOptions<TTransients>
	>;
} & CallbackDefineOptions<Blog, Prisma.BlogCreateInput, TTransients>;
type BlogFactoryDefineOptions<
	TTransients extends Record<string, unknown> = Record<string, unknown>,
> = {
	defaultData?: Resolver<BlogFactoryDefineInput, BuildDataOptions<TTransients>>;
	traits?: {
		[traitName: TraitName]: BlogFactoryTrait<TTransients>;
	};
} & CallbackDefineOptions<Blog, Prisma.BlogCreateInput, TTransients>;
type BlogTraitKeys<TOptions extends BlogFactoryDefineOptions<any>> = Exclude<
	keyof TOptions["traits"],
	number
>;
export interface BlogFactoryInterfaceWithoutTraits<
	TTransients extends Record<string, unknown>,
> {
	readonly _factoryFor: "Blog";
	build(
		inputData?: Partial<Prisma.BlogCreateInput & TTransients>,
	): PromiseLike<Prisma.BlogCreateInput>;
	buildCreateInput(
		inputData?: Partial<Prisma.BlogCreateInput & TTransients>,
	): PromiseLike<Prisma.BlogCreateInput>;
	buildList(
		list: readonly Partial<Prisma.BlogCreateInput & TTransients>[],
	): PromiseLike<Prisma.BlogCreateInput[]>;
	buildList(
		count: number,
		item?: Partial<Prisma.BlogCreateInput & TTransients>,
	): PromiseLike<Prisma.BlogCreateInput[]>;
	pickForConnect(inputData: Blog): Pick<Blog, "id">;
	create(
		inputData?: Partial<Prisma.BlogCreateInput & TTransients>,
	): PromiseLike<Blog>;
	createList(
		list: readonly Partial<Prisma.BlogCreateInput & TTransients>[],
	): PromiseLike<Blog[]>;
	createList(
		count: number,
		item?: Partial<Prisma.BlogCreateInput & TTransients>,
	): PromiseLike<Blog[]>;
	createForConnect(
		inputData?: Partial<Prisma.BlogCreateInput & TTransients>,
	): PromiseLike<Pick<Blog, "id">>;
}
export interface BlogFactoryInterface<
	TTransients extends Record<string, unknown> = Record<string, unknown>,
	TTraitName extends TraitName = TraitName,
> extends BlogFactoryInterfaceWithoutTraits<TTransients> {
	use(
		name: TTraitName,
		...names: readonly TTraitName[]
	): BlogFactoryInterfaceWithoutTraits<TTransients>;
}
interface BlogFactoryBuilder {
	<TOptions extends BlogFactoryDefineOptions>(
		options?: TOptions,
	): BlogFactoryInterface<{}, BlogTraitKeys<TOptions>>;
	withTransientFields: <TTransients extends BlogTransientFields>(
		defaultTransientFieldValues: TTransients,
	) => <TOptions extends BlogFactoryDefineOptions<TTransients>>(
		options?: TOptions,
	) => BlogFactoryInterface<TTransients, BlogTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Blog} model.
 *
 * @param options
 * @returns factory {@link BlogFactoryInterface}
 */
export declare const defineBlogFactory: BlogFactoryBuilder;
