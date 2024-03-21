package twitch

import (
	"github.com/jellemeeus/compilations/config"
	"github.com/nicklaw5/helix"
)

func Initialize(config config.TwitchConfig) (*helix.Client, error) {
	twitch, err := NewClient(&config)
	return twitch.client, err
}

type Twitch struct {
	client *helix.Client
}

func NewClient(config *config.TwitchConfig) (*Twitch, error) {
	client, err := helix.NewClient(&helix.Options{
		ClientID:     config.ClientId,
		ClientSecret: config.ClientSecret,
	})
	if err != nil {
		return nil, err
	}

	twitch := &Twitch{client: client}
	if err := twitch.RefreshOAuthToken(); err != nil {
		return nil, err
	}

	return twitch, nil
}

func (t *Twitch) RefreshOAuthToken() error {
	appAccessTokenResponse, err := t.client.RequestAppAccessToken([]string{})
	if err != nil {
		return err
	}
	t.client.SetAppAccessToken(appAccessTokenResponse.Data.AccessToken)
	return nil
}
