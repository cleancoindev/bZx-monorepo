/* globals test, expect, describe, beforeEach, afterEach, jest */
import { constants } from "0x.js/lib/src/utils/constants";
import { BigNumber } from "@0xproject/utils";
import { assert } from "@0xproject/assert";
import * as Addresses from "./constants/addresses";
import b0xJS from "./setup";

jest.setTimeout(10000);

describe("allowance", () => {
  const tokenAddress = Addresses.TEST_TOKENS[0];
  const ownerAddress = Addresses.ACCOUNTS[0];
  const spenderAddress = Addresses.B0x;

  const resetAllowance = async () => {
    await b0xJS.setAllowance({
      tokenAddress,
      ownerAddress,
      spenderAddress,
      amountInBaseUnits: new BigNumber(0)
    });
  };

  beforeEach(resetAllowance);
  afterEach(resetAllowance);

  describe("setAllowance", () => {
    const ALLOWANCE_AMOUNT = new BigNumber(436);

    test("should output transaction hash", async () => {
      const txHash = await b0xJS.setAllowance({
        tokenAddress,
        ownerAddress,
        spenderAddress,
        amountInBaseUnits: ALLOWANCE_AMOUNT
      });

      assert.isHexString("txHash", txHash);
    });

    test("should set spender's allowance", async () => {
      const expectedAllowance = ALLOWANCE_AMOUNT;

      await b0xJS.setAllowance({
        tokenAddress,
        ownerAddress,
        spenderAddress,
        amountInBaseUnits: ALLOWANCE_AMOUNT
      });

      const allowance = await b0xJS.getAllowance({
        tokenAddress,
        ownerAddress,
        spenderAddress
      });

      expect(allowance).toEqual(expectedAllowance);
    });
  });

  describe("setAllowanceUnlimited", () => {
    test("should set spender's allowance to maximum value of uint", async () => {
      const expectedAllowance = constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS;

      await b0xJS.setAllowanceUnlimited({
        tokenAddress,
        ownerAddress,
        spenderAddress
      });

      const allowance = await b0xJS.getAllowance({
        tokenAddress,
        ownerAddress,
        spenderAddress
      });

      expect(allowance).toEqual(expectedAllowance);
    });
  });

  describe("getAllowance", () => {
    test("should return allowance", async () => {
      const res = await b0xJS.getAllowance({
        tokenAddress,
        ownerAddress,
        spenderAddress
      });

      expect(res).toEqual(new BigNumber(0));
    });
  });

  describe("resetAllowance", () => {
    test.only("should reset allowance", async () => {
      await b0xJS.setAllowanceUnlimited({
        tokenAddress,
        ownerAddress,
        spenderAddress
      });

      await b0xJS.resetAllowance({
        tokenAddress,
        ownerAddress,
        spenderAddress
      });

      const res = await b0xJS.getAllowance({
        tokenAddress,
        ownerAddress,
        spenderAddress
      });

      expect(res).toEqual(new BigNumber(0));
    });
  });
});
