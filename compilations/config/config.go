package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type TwitchConfig struct {
	ClientId     string `mapstructure:"client-id"`
	ClientSecret string `mapstructure:"client-secret"`
}

type YoutubeConfig struct {
	APIKey string `mapstructure:"api-key"`
}

type Config struct {
	Twitch  TwitchConfig  `mapstructure:"twitch"`
	Youtube YoutubeConfig `mapstructure:"youtube"`
}

func New() (cfg Config, err error) {
	v := viper.New()
	v.SetConfigName("config")
	v.AddConfigPath(".")
	if err := v.ReadInConfig(); err != nil {
		return cfg, fmt.Errorf("couldn't load config: %w", err)
	}
	var c Config
	if err := v.Unmarshal(&c); err != nil {
		return cfg, fmt.Errorf("couldn't read config: %w", err)

	}
	fmt.Printf("%#v", c)
	return c, nil
}
