/**
 * AdminDO Hono Integration - Type Definitions
 */

import { Hono } from 'hono'

/**
 * Represents an instance of a Durable Object
 */
export interface Instance {
  /** The unique slug identifier for the instance */
  slug: string
  /** The display name of the instance */
  name: string
}

/**
 * Plugin configuration for AdminDO Hono integration
 */
export interface Plugin {
  /** The unique slug identifier for the plugin */
  slug: string
  /** Function that creates a Hono app instance for the plugin */
  create: (config: any) => any
}

/**
 * Configuration for a single Durable Object
 */
export interface DurableObjectConfigItem {
  /** The name of the Durable Object */
  name: string
  /** Function to get instances, optionally paginated */
  getInstances: (page?: number) => Promise<Instance[]>
}

/**
 * Configuration object for Durable Objects
 */
export type DurableObjectConfig = Record<string, DurableObjectConfigItem>

/**
 * Main AdminDO configuration object
 */
export interface AdminDOConfig {
  /** Whether to enable demo mode */
  demo: boolean
  /** Array of Durable Object configurations that will be registered with AdminDO */
  dos: DurableObjectConfig
  /** Array of plugin configurations that will be registered with AdminDO */
  plugins: Plugin[]
}

/**
 * Create AdminDO instance integrated with Hono
 */
export declare function admindo(config: AdminDOConfig): Hono
