import { expect } from "chai";
import { mount } from "@vue/test-utils";
import Counter from "@/components/Counter.vue";

const factory = (propsData) => {
  return mount(Counter, {
    propsData: { value: 50, loading: false, animation: "default 500 100", ...propsData },
  });
};
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};

describe("[ Counter.vue ]", () => {
  describe("#value", async () => {
    const values = [
      { value: -45.2456, count: 4, start: "0.0000" },
      { value: 56.34, count: 2, start: "0.00" },
      { value: "25,564", count: 3, start: "0,000" },
      { value: "-30,5", count: 1, start: "0,0" },
    ];
    for (const val of values) {
      const { value, count, start } = val;
      const counterWrapper = factory({ value });

      it(`counts the decimals correctly for ${value}`, () => {
        expect(counterWrapper.vm.countDecimals()).to.equal(count);
      });

      if (value.toString().includes(",")) {
        it("accepts `,` as delimiter", () => {
          expect(counterWrapper.vm.delimiter).to.equal(",");
        });

        it("displays the provided #value with `,` as delimiter", () => {
          expect(counterWrapper.element.textContent).to.have.string(",");
        });

        it("converts #value to decimal correctly, if provided with `,` as delimiter", () => {
          expect(counterWrapper.vm.end).to.equal(parseFloat(value.toString().replace(",", ".")));
        });
      }

      it("parses #animation prop correctly", () => {
        expect(counterWrapper.vm.duration).to.equal(500);
        expect(counterWrapper.vm.delay).to.equal(100);
      });

      it("shows the start value with the correct number of decimals places", () => {
        expect(counterWrapper.element.textContent).to.equal(start);
      });

      it("calculates the difference between the start and end values correctly", () => {
        const endValue = parseFloat(value.toString().replace(",", "."));
        const startValue = 0;
        const diff = Math.abs(endValue - startValue);
        expect(counterWrapper.vm.difference).to.equal(diff);
      });

      it("calculates the one step count value correctly", () => {
        const endValue = parseFloat(value.toString().replace(",", "."));
        const startValue = 0;
        const diff = Math.abs(endValue - startValue);
        const duration = 500;
        const oneStepCountValue = diff / duration;
        expect(counterWrapper.vm.oneStepDifference).to.equal(oneStepCountValue);
      });

      it("calculates the one step count value correctly with 0 duration", () => {
        counterWrapper.setProps({ animation: "default 0 0" });
        const endValue = parseFloat(value.toString().replace(",", "."));
        const startValue = 0;
        const diff = Math.abs(endValue - startValue);
        expect(counterWrapper.vm.oneStepDifference).to.equal(diff);
      });
    }
  });
});
