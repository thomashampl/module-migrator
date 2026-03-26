import { describe, expect, it } from "vitest";
import { formatFileSize, formatModuleType, pluralize } from "./utils";

describe("formatFileSize", () => {
	it("formats bytes", () => {
		expect(formatFileSize(0)).toBe("0 B");
		expect(formatFileSize(100)).toBe("100 B");
		expect(formatFileSize(1023)).toBe("1023 B");
	});

	it("formats kilobytes", () => {
		expect(formatFileSize(1024)).toBe("1.0 KB");
		expect(formatFileSize(1536)).toBe("1.5 KB");
		expect(formatFileSize(10240)).toBe("10.0 KB");
		expect(formatFileSize(1024 * 1024 - 1)).toBe("1024.0 KB");
	});

	it("formats megabytes", () => {
		expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
		expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1.5 MB");
		expect(formatFileSize(10 * 1024 * 1024)).toBe("10.0 MB");
	});
});

describe("formatModuleType", () => {
	it("extracts module name from namespaced type", () => {
		expect(formatModuleType("pipedrive:SearchForActivity")).toBe(
			"SearchForActivity",
		);
		expect(formatModuleType("google:DriveUpload")).toBe("DriveUpload");
	});

	it("returns original if no namespace", () => {
		expect(formatModuleType("SearchForActivity")).toBe("SearchForActivity");
		expect(formatModuleType("")).toBe("");
	});

	it("handles multiple colons by taking first part after split", () => {
		// split(":") returns ["namespace", "module", "extra"], index 1 is "module"
		expect(formatModuleType("namespace:module:extra")).toBe("module");
	});
});

describe("pluralize", () => {
	it("returns singular for count of 1", () => {
		expect(pluralize(1, "module")).toBe("module");
		expect(pluralize(1, "item")).toBe("item");
	});

	it("returns plural for count other than 1", () => {
		expect(pluralize(0, "module")).toBe("modules");
		expect(pluralize(2, "module")).toBe("modules");
		expect(pluralize(100, "item")).toBe("items");
	});

	it("uses custom plural when provided", () => {
		expect(pluralize(0, "child", "children")).toBe("children");
		expect(pluralize(2, "person", "people")).toBe("people");
		expect(pluralize(1, "person", "people")).toBe("person");
	});

	it("handles negative numbers", () => {
		expect(pluralize(-1, "module")).toBe("modules");
		expect(pluralize(-5, "item")).toBe("items");
	});
});
