/**
 * Utilidades compartidas para reports
 */

export const toNumber = (value: string | undefined, fallback: number): number => {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const getParam = (value: string | string[] | undefined): string =>
	Array.isArray(value) ? value[0] : value ?? "";

export const buildWhereClause = (
	filters: string[],
	values: Array<string | number>
): string => {
	return filters.length ? `WHERE ${filters.join(" AND ")}` : "";
};

export const createPaginationLink = (
	params: Record<string, string>,
	targetPage: number,
	pageSize: number
): string => {
	const urlParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value) urlParams.set(key, value);
	});
	urlParams.set("page", String(targetPage));
	urlParams.set("pageSize", String(pageSize));
	return `?${urlParams.toString()}`;
};

export const calculatePagination = (
	page: number,
	pageSize: number
): { offset: number; limit: number } => {
	const offset = (page - 1) * pageSize;
	return { offset, limit: pageSize };
};
