// https://stackoverflow.com/questions/76400750/intl-supportedvaluesof-property-supportedvaluesof-does-not-exist-on-type-type
declare namespace Intl {
  type Key = "calendar" | "collation" | "currency" | "numberingSystem" | "timeZone" | "unit";

  function supportedValuesOf(input: Key): string[];
}