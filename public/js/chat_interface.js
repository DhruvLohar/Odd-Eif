class Interface {
    add_message_self(msg) {
        return `
        <div class="message self py-1">
            <div class="message-content p-2">
                <span>${msg}</span>
            </div>
        </div>
        `;
    }

    add_message(msg, name) {
        return `
        <div class="message py-1">
            <div class="message-content p-2">
                <span class="username">-- ${name} --</span><br>
                ${msg}
            </div>
        </div>
        `;
    }

    add_info_joined(name) {
        return `
        <div class="message-info p-1">
            <span>${name} connected</span>
        </div>
        `;
    }

    add_info_left(name) {
        return `
        <div class="message-info left p-1">
            <span>${name} disconnected</span>
        </div>
        `;
    }
}