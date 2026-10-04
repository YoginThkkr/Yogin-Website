import portfolioData from "../data/portfolio.json";
import type { Portfolio } from "../types/portfolio";

const data = portfolioData as Portfolio;

export function usePortfolio(): Portfolio {
  return data;
}
