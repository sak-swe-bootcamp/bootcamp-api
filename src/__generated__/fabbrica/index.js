import {
	createInitializer,
	createScreener,
	getScalarFieldValueGenerator,
	normalizeResolver,
	normalizeList,
	getSequenceCounter,
	createCallbackChain,
	destructure,
} from "@quramy/prisma-fabbrica/lib/internal";
export {
	resetSequence,
	registerScalarFieldValueGenerator,
	resetScalarFieldValueGenerator,
} from "@quramy/prisma-fabbrica/lib/internal";
const initializer = createInitializer();
const { getClient } = initializer;
export const { initialize } = initializer;
const modelFieldDefinitions = [
	{
		name: "Blog",
		fields: [],
	},
];
function autoGenerateBlogScalarsOrEnums({ seq }) {
	return {
		title: getScalarFieldValueGenerator().String({
			modelName: "Blog",
			fieldName: "title",
			isId: false,
			isUnique: false,
			seq,
		}),
		content: getScalarFieldValueGenerator().String({
			modelName: "Blog",
			fieldName: "content",
			isId: false,
			isUnique: false,
			seq,
		}),
		userName: getScalarFieldValueGenerator().String({
			modelName: "Blog",
			fieldName: "userName",
			isId: false,
			isUnique: false,
			seq,
		}),
		userImage: getScalarFieldValueGenerator().String({
			modelName: "Blog",
			fieldName: "userImage",
			isId: false,
			isUnique: false,
			seq,
		}),
	};
}
function defineBlogFactoryInternal(
	{
		defaultData: defaultDataResolver,
		onAfterBuild,
		onBeforeCreate,
		onAfterCreate,
		traits: traitsDefs = {},
	},
	defaultTransientFieldValues,
) {
	const getFactoryWithTraits = (traitKeys = []) => {
		const seqKey = {};
		const getSeq = () => getSequenceCounter(seqKey);
		const screen = createScreener("Blog", modelFieldDefinitions);
		const handleAfterBuild = createCallbackChain([
			onAfterBuild,
			...traitKeys.map((traitKey) => traitsDefs[traitKey]?.onAfterBuild),
		]);
		const handleBeforeCreate = createCallbackChain([
			...traitKeys
				.slice()
				.reverse()
				.map((traitKey) => traitsDefs[traitKey]?.onBeforeCreate),
			onBeforeCreate,
		]);
		const handleAfterCreate = createCallbackChain([
			onAfterCreate,
			...traitKeys.map((traitKey) => traitsDefs[traitKey]?.onAfterCreate),
		]);
		const build = async (inputData = {}) => {
			const seq = getSeq();
			const requiredScalarData = autoGenerateBlogScalarsOrEnums({ seq });
			const resolveValue = normalizeResolver(defaultDataResolver ?? {});
			const [transientFields, filteredInputData] = destructure(
				defaultTransientFieldValues,
				inputData,
			);
			const resolverInput = { seq, ...transientFields };
			const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
				const acc = await queue;
				const resolveTraitValue = normalizeResolver(
					traitsDefs[traitKey]?.data ?? {},
				);
				const traitData = await resolveTraitValue(resolverInput);
				return {
					...acc,
					...traitData,
				};
			}, resolveValue(resolverInput));
			const defaultAssociations = {};
			const data = {
				...requiredScalarData,
				...defaultData,
				...defaultAssociations,
				...filteredInputData,
			};
			await handleAfterBuild(data, transientFields);
			return data;
		};
		const buildList = (...args) =>
			Promise.all(normalizeList(...args).map((data) => build(data)));
		const pickForConnect = (inputData) => ({
			id: inputData.id,
		});
		const create = async (inputData = {}) => {
			const data = await build({ ...inputData }).then(screen);
			const [transientFields] = destructure(
				defaultTransientFieldValues,
				inputData,
			);
			await handleBeforeCreate(data, transientFields);
			const createdData = await getClient().blog.create({ data });
			await handleAfterCreate(createdData, transientFields);
			return createdData;
		};
		const createList = (...args) =>
			Promise.all(normalizeList(...args).map((data) => create(data)));
		const createForConnect = (inputData = {}) =>
			create(inputData).then(pickForConnect);
		return {
			_factoryFor: "Blog",
			build,
			buildList,
			buildCreateInput: build,
			pickForConnect,
			create,
			createList,
			createForConnect,
		};
	};
	const factory = getFactoryWithTraits();
	const useTraits = (name, ...names) => {
		return getFactoryWithTraits([name, ...names]);
	};
	return {
		...factory,
		use: useTraits,
	};
}
/**
 * Define factory for {@link Blog} model.
 *
 * @param options
 * @returns factory {@link BlogFactoryInterface}
 */
export const defineBlogFactory = (options) => {
	return defineBlogFactoryInternal(options ?? {}, {});
};
defineBlogFactory.withTransientFields =
	(defaultTransientFieldValues) => (options) =>
		defineBlogFactoryInternal(options ?? {}, defaultTransientFieldValues);
