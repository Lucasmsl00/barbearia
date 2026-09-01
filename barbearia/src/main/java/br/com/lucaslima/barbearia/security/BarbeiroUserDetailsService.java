package br.com.lucaslima.barbearia.security;

import br.com.lucaslima.barbearia.model.Barbeiro;
import br.com.lucaslima.barbearia.repository.BarbeiroRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BarbeiroUserDetailsService implements UserDetailsService {

    private final BarbeiroRepository barbeiroRepository;

    public BarbeiroUserDetailsService(BarbeiroRepository barbeiroRepository) {
        this.barbeiroRepository = barbeiroRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Barbeiro barbeiro = barbeiroRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Barbeiro não encontrado: " + email));

        return new User(
                barbeiro.getEmail(),
                barbeiro.getSenhaHash(),
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_BARBEIRO"))
        );
    }
}
