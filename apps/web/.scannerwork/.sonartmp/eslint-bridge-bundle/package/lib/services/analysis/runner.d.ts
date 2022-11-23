import express from 'express';
import { Analysis } from './analysis';
/**
 * Runs an analysis
 *
 * This function is a generic analyzer used for any kind of analysis request,
 * be it a YAML, CSS, JavaScrip or TypeScript analysis request. The point is
 * to centralize the extraction of the analysis input, executes the concrete
 * analysis function, and either return the analysis output or forward back
 * any analysis error to the requester.
 *
 * @param analysis the analysis function to run
 */
export declare function runner(analysis: Analysis): express.RequestHandler;
